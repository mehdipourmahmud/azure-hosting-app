import sql from 'mssql';

export default class Database {
  config = {};
  poolconnection = null;
  connected = false;

  constructor(config) {
    this.config = config;
    console.log(`Database: config: ${JSON.stringify(config)}`);
  }

  async connect() {
    try {
      console.log(`Database connecting...${this.connected}`);
      if (this.connected === false) {
        this.poolconnection = await sql.connect(this.config);
        this.connected = true;
        console.log('Database connection successful');
      } else {
        console.log('Database already connected');
      }
    } catch (error) {
      console.error(`Error connecting to database: ${JSON.stringify(error)}`);
    }
  }

  async disconnect() {
    try {
      if (this.connected) {
        await this.poolconnection.close();
        this.connected = false;
        console.log('Database connection closed');
      } else {
        console.log('Database not connected');
      }
    } catch (error) {
      console.error(`Error closing database connection: ${error}`);
    }
  }
  

  async executeQuery(query) {
    await this.connect();
    const request = this.poolconnection.request();
    const result = await request.query(query);

    return result.rowsAffected[0];
  }

  async createBook(data) {
    await this.connect();
    const request = this.poolconnection.request();

    request.input('title', sql.NVarChar(255), data.title);
    request.input('author', sql.NVarChar(255), data.author);
    request.input('content', sql.NVarChar(sql.MAX), data.content);

    const result = await request.query(
      `INSERT INTO Books (Title, Author, Content) VALUES (@title, @author, @content)`
    );

    return result.rowsAffected[0];
  }

  async readAllBooks() {
    await this.connect();
    const request = this.poolconnection.request();
    const result = await request.query(`SELECT * FROM Books`);
    return result.recordsets[0];
  }

  async readBook(id) {
    await this.connect();

    const request = this.poolconnection.request();
    const result = await request
      .input('id', sql.Int, +id)
      .query(`SELECT * FROM Books WHERE BookID = @id`);

    return result.recordset[0];
  }

  async updateBook(id, data) {
    await this.connect();

    const request = this.poolconnection.request();

    request.input('id', sql.Int, +id);
    request.input('title', sql.NVarChar(255), data.title);
    request.input('author', sql.NVarChar(255), data.author);
    request.input('content', sql.NVarChar(sql.MAX), data.content);

    const result = await request.query(
      `UPDATE Books SET Title=@title, Author=@author, Content=@content WHERE BookID = @id`
    );

    return result.rowsAffected[0];
  }

  async deleteBook(id) {
    await this.connect();

    const idAsNumber = Number(id);

    const request = this.poolconnection.request();
    const result = await request
      .input('id', sql.Int, idAsNumber)
      .query(`DELETE FROM Books WHERE BookID = @id`);

    return result.rowsAffected[0];
  }
}
