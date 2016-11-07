import Dexie from 'dexie';

const database = new Dexie('media');
database.version(1).stores({
  videos: '++id,name,uri,createdAt',
});

export default database;
