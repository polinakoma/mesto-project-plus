import BadRequestError from '../errors/bad-request';
import { URL_REGEXP } from '../utils/constants';

const isValidUrl = (url: string) => URL_REGEXP.test(url); // возвращает булевое

const testUrl = (url: string) => {
  if (!isValidUrl) {
    throw new BadRequestError('Некорректный адрес');
  }
  return url;
};

export default testUrl;
