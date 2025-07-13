require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const axios = require('axios');
const config = require('./utils/config');

const sendEmail = async (to, content) => {
  const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: Number(config.mail.port),
    secure: false,
    auth: {
      user: config.mail.user,
      pass: config.mail.password,
    },
  });

  await transporter.sendMail({
    from: config.mail.user,
    to,
    subject: 'Hasil Ekspor Playlist Anda',
    text: 'Berikut adalah data playlist Anda.',
    attachments: [
      {
        filename: 'playlist.json',
        content: JSON.stringify(content, null, 2),
      },
    ],
  });

  console.log(`📤 Email berhasil dikirim ke ${to}`);
};

const getPlaylistData = async (playlistId) => {
  try {
    const response = await axios.get(`${process.env.OPENMUSIC_API_URL}/playlists/${playlistId}/songs`);
    return response.data.data;
  } catch (error) {
    console.error('❌ Gagal mengambil data playlist:', error.message);
    return null;
  }
};

const consume = async () => {
  const connection = await amqp.connect(config.rabbitMq.server);
  const channel = await connection.createChannel();
  const queue = 'export:playlists';

  await channel.assertQueue(queue, { durable: true });
  console.log('🔃 Menunggu pesan di queue:', queue);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const { playlistId, targetEmail } = JSON.parse(msg.content.toString());
      console.log(`📩 Menerima permintaan ekspor untuk playlist ${playlistId}`);

      const playlistData = await getPlaylistData(playlistId);
      if (playlistData) {
        await sendEmail(targetEmail, playlistData);
        channel.ack(msg);
      } else {
        console.error('❌ Data playlist kosong. Email tidak dikirim.');
        channel.nack(msg, false, false);
      }
    }
  }, { noAck: false });
};

consume();