import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { parse } from 'csv-parse';
import { User } from '../../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class StoreService {
  private store: AWS.S3;
  private readonly logger = new Logger(StoreService.name);

  constructor(@InjectModel(User.name) private user: Model<User>) {
    if (process.env.USE_DIGITALOCEAN === 'true') {
      const spacesEndpoint = new AWS.Endpoint(
        process.env.DIGITALOCEAN_URI ?? '',
      );
      this.store = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: process.env.DIGITALOCEAN_ACCESS_KEY ?? '',
        secretAccessKey: process.env.DIGITALOCEAN_SECRET ?? '',
        s3ForcePathStyle: true,
      });
    }
  }

  async processFile() {
    if (process.env.USE_DIGITALOCEAN !== 'true') return;
    try {
      const Bucket = process.env.DIGITALOCEAN_BUCKET_NAME ?? '';
      const Prefix = process.env.DIGITALOCEAN_BUCKET_PATH ?? '';
      const { Contents } = await this.store
        .listObjects({ Bucket, Prefix })
        .promise();
      if (Contents.length === 0) {
        this.logger.log(`Not Found Directory`);
        return;
      }

      const contents = Contents.filter((f) => f.Key !== `${Prefix}/`);
      if (contents.length === 0) {
        this.logger.log(`Not Found File In Directory`);
        return;
      }

      for (const detail of contents) {
        try {
          this.logger.log(`Process File key:${detail.Key} Start`);
          const fileBuffer = await this.getFile(Bucket, detail.Key);
          const data = await this.readFile(fileBuffer);
          await this.saveData(data);
          await this.deleteFile(Bucket, detail.Key);
          this.logger.log(`Process File key:${detail.Key} End`);
        } catch (error) {
          this.logger.log(`Process File key:${detail.Key} Error`);
        }
      }
    } catch (error) {
      this.logger.log(`Process File Error`);
    }
  }

  async getFile(bucket: string, Key: string): Promise<Buffer> {
    const body = {
      Bucket: bucket,
      Key: Key,
    };
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      this.store.getObject(body, function (err, data) {
        if (err) {
          reject(err);
        }
        if (!data.Body) reject('Not found file');
        resolve(data.Body as Buffer);
      });
    });
    return fileBuffer;
  }

  async deleteFile(bucket: string, Key: string): Promise<void> {
    const body = {
      Bucket: bucket,
      Key: Key,
    };
    await new Promise<void>((resolve, reject) => {
      this.store.deleteObject(body, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  async readFile(buffer: Buffer): Promise<User[]> {
    const decodedString = buffer.toString('utf-8');
    const records = [];
    const parser = parse({
      delimiter: ',',
    });

    await new Promise<void>((resolve, reject) => {
      try {
        parser.on('readable', function () {
          let record;
          while ((record = parser.read()) !== null) {
            records.push(record);
          }
        });

        parser.on('error', function (err) {
          reject(err);
        });

        parser.on('end', function () {
          resolve();
        });

        parser.write(decodedString);
        parser.end();
      } catch (error) {
        reject(error);
      }
    });

    const users: User[] = [];
    for (const record of records) {
      const user: User = {
        firstname: record[0],
        surname: record[1],
      };
      users.push(user);
    }

    return users;
  }

  async saveData(users: User[]): Promise<void> {
    await this.user.insertMany(users);
  }
}
