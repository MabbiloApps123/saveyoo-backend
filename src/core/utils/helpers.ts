// import { Twilio } from 'twilio';
import { uuid } from 'uuidv4';
import { BulkCreateOptions } from 'sequelize';
import Encryption from './encryption';
import { logger } from './logger';

export default class Helpers {

  static uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  static lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  static generateOTP() {
    const otp = Math.floor(1000 + Math.random() * 9000);
    logger.info(`Generate_OTP_Exit_otp: ` + JSON.stringify(otp.toString()));
    return otp.toString();
  }
  static async extracAndDecrypt(auth: any, decryptData: any) {
    let keys = Object.keys(auth);
    for (const key of keys) {
      if (!decryptData.includes(key)) {
        auth[key] = auth[key] ? Encryption.decryptValue(auth[key]) : auth[key];
      } else {
        auth[key] = auth[key];
      }
    }
    return auth;
  }


  static async findOne(schema, query) {
    const result = await schema.findOne(query);
    return result?.dataValues ? result.dataValues : result;
  }
  static async findAll(schema: any, query) {
    const result = await schema.findAll(query);
    return result?.dataValues ? result.dataValues : result;
  }

  static async create(schema, body) {
    const result = await schema.create(body);
    return result.dataValues;
  }
  static async findAndCountAll(schema, body) {
    const result = await schema.findAndCountAll(body);
    return result;
  }
  static async findOrCreate(schema, query) {
    const result = await schema.findOrCreate(query);
    return result;
  }
  static async bulkCreate(schema, body: Array<any>, bulkCreateOptions?: BulkCreateOptions) {
    const result = await schema.bulkCreate(body, bulkCreateOptions);
    return result;
  }
  static generateRandomPassword = () => {
    const specialCharacters = '!@#$%^&*';
    const digits = '0123456789';

    const uppercaseLetter = this.getRandomCharacter(this.uppercaseLetters);
    const specialCharacter = this.getRandomCharacter(specialCharacters);
    const digit = this.getRandomCharacter(digits);
    const randomString = this.getRandomString(5, this.lowercaseLetters);

    // getRandomString(7, uppercaseLetters + lowercaseLetter+ specialCharacters + digits);

    return uppercaseLetter + randomString + specialCharacter + digit;
  };

  static getRandomCharacter(characters) {
    return characters.charAt(Math.floor(Math.random() * characters.length));
  }

  static getRandomString(length, characters) {
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += this.getRandomCharacter(characters);
    }
    return randomString;
  }

  static async update(schema, query, body) {
    let data = await schema.update(
      {
        ...body,
      },
      {
        ...query,
        returning: true, // Return the updated row data
      },
    );

    return data[1];
  }
  static async collectionDelete(schema, query) {
    const rowCount = await schema.destroy(query);
    return {
      statusCode: 200,
      status: rowCount > 0 ? true : false,
      message: rowCount > 0 ? ' deleted successfully' : '  not yet to delete  ',
      data: rowCount,
    };
  }
  static async softDelete(schema, query) {
    const rowCount = await schema.update({ is_active: false, is_deleted: true }, { ...query });
    await schema.destroy({ ...query });
    return {
      statusCode: 200,
      status: rowCount > 0 ? true : false,
      message: rowCount > 0 ? ' deleted successfully' : '  not yet to delete  ',
      data: rowCount,
    };
  }
  static async collectionFindAndCountAll(schema, query) {
    let result = await schema.findAndCountAll(query);
    return {
      ...result,
      message:
        result.count === 0 ? '  No Data found ' : ' data fetched successfully',
    };
  }

  generateOTP() {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000);
      return otp.toString();
    } catch (ex) {
      return {
        error: ex,
        message: 'Exception Error Occured',
      };
    }
  }

  static generateInvoiceNumber(prefix: string) {
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    let lastInvoiceNumber = 1000; // This could be retrieved from your database
    const newInvoiceNumber = lastInvoiceNumber + 1;
    const finalInvoiceNumber = `${prefix}-${currentDate}-${newInvoiceNumber}`;
    lastInvoiceNumber = newInvoiceNumber;
    return finalInvoiceNumber;
  }

  static async getMasterIds(filter_arr: Array<string>, field: string, schema) {
    let filter_qry = {
      attributes: ['id'],
      where: {
        [field]: filter_arr,
      },
    };
    let master_data = await Helpers.findAll(schema, filter_qry);
    let master_ids = master_data.map((data) => data.dataValues.id);
    return master_ids;
  }

  static generateCartId = () => {
    const cartId = uuid();
    return cartId;
  };

  static async generaterandomCouponcode() {
    let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@$&';
    let copounCode = '';

    for (let i = 0; i < 7; i++) {
      let randomCode = Math.floor(Math.random() * charSet.length);
      copounCode += charSet.charAt(randomCode);
    }
    return copounCode;
  }

}
