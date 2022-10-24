import { Request, Response, Router } from "express";
import {User} from "../entities/User";
import {isEmpty, validate} from "class-validator";

const mapErrors = (errors: Object[]) => {
  return errors.reduce((previousValue: any, err: any) => {
    previousValue[err.property] = Object.entries(err.constraints)[0][1];
    return previousValue;
  },{});
}

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let errors: any = {};

    // 이메일과 유저이름이 이미 저장 사용되고 있는 것인지 확인
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    // 이미 있다면 error 객체에 넣어줌.
    if (emailUser) errors.email = '이미 사용중인 이메일 주소 입니다.';
    if (usernameUser) errors.username = '이미 사용중인 사용자 이름입니다.';

    // 에러가 있다면 return 으로 에러를 response 보내줌.
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors)
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    // 엔티티에 정해 놓은 조건으로 user 데이터의 유효성 검사를 해줌.
    errors = await validate(user);

    if (errors.length > 0) return res.status(400).json(mapErrors(errors));

    // 유저 정보를 user 테이블에 저장.
    await user.save();
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
}

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
  } catch (e) {

  }
}

const router = Router();
router.post('/register', register);

export default router;