/*!
 * My lib
 */
export {
  /** 版本信息 */
  // eslint-disable-next-line
  version as VERSION, // @ts-ignore
} from '../package.json';
/**
 * 类
 */
export class Hello {
  static str = 'Hello world!';

  static getStr() {
    return Hello.str;
  }
}
