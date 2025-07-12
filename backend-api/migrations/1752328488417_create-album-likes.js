/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    userId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    albumId: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('album_likes', 'unique_user_album_like', {
    unique: ['userId', 'albumId'],
  });

  pgm.addConstraint('album_likes', 'fk_album_like.user', {
    foreignKeys: {
      columns: 'userId',
      references: 'users(id)',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint('album_likes', 'fk_album_like.album', {
    foreignKeys: {
      columns: 'albumId',
      references: 'albums(id)',
      onDelete: 'cascade',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('album_likes');
};
