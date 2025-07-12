const pool = require('./pool');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumLikesService {
  constructor(cacheService, pool) {
    this._cacheService = cacheService;
    this._pool = pool;
  }

  async likeAlbum(albumId, userId) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO album_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    try {
      await this._pool.query(query);
    } catch (error) {
      if (error.code === '23505') {
        throw new InvariantError('Anda sudah menyukai album ini');
      }
      throw error;
    }

    await this._cacheService.delete(`albumLikes:${albumId}`);
  }

  async unlikeAlbum(albumId, userId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE "userId" = $1 AND "albumId" = $2',
      values: [userId, albumId],
    };

    await this._pool.query(query);
    await this._cacheService.delete(`albumLikes:${albumId}`);
  }

  async getAlbumLikes(albumId) {
    try {
      const result = await this._cacheService.get(`albumLikes:${albumId}`);
      return { source: 'cache', likes: result };
    } catch {
      const result = await this._pool.query({
        text: 'SELECT COUNT(*) AS likes FROM album_likes WHERE "albumId" = $1',
        values: [albumId],
      });

      const likes = Number(result.rows[0].likes);
      await this._cacheService.set(`albumLikes:${albumId}`, likes);
      return { source: 'db', likes };
    }
  }

  async verifyAlbumExists(id) {
    const result = await this._pool.query({
      text: 'SELECT id FROM albums WHERE id = $1',
      values: [id],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }
}

module.exports = AlbumLikesService;