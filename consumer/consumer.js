require('dotenv').config();
const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});
//const axios = require('axios');
const config = require('./utils/config');

const sendEmail = async (to, content) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
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
  const playlistQuery = {
    text: 'SELECT playlists.id, playlists.name FROM playlists WHERE playlists.id = $1',
    values: [playlistId],
  };

  const songsQuery = {
    text: `SELECT songs.id, songs.title, songs.performer
           FROM songs
           JOIN playlist_songs ON songs.id = playlist_songs."songId"
           WHERE playlist_songs."playlistId" = $1`,
    values: [playlistId],
  };

  const playlistResult = await pool.query(playlistQuery);
  const songsResult = await pool.query(songsQuery);

  if (!playlistResult.rowCount) return null;

  return {
    playlist: {
      id: playlistResult.rows[0].id,
      name: playlistResult.rows[0].name,
      songs: songsResult.rows,
    },
  };
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