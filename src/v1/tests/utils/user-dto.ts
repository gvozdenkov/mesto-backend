/* eslint-disable no-underscore-dangle */
import { USER, User, UserDocument } from '#user';
import { randomeString } from '#utils';

export var randomeUser = (options = {}) => {
  var name = randomeString(USER.nameMinLength, USER.nameMaxLength);
  var about = randomeString(USER.aboutMinLength, USER.aboutMaxLength);
  var avatar = randomeString(8, 12);
  var email = randomeString(5, 10).toLowerCase();
  var password = randomeString(8, 15);

  return {
    name,
    about,
    avatar: `https://some.site.net/images/${avatar}.jpg`,
    email: `${email}@mail.com`,
    password,
    ...(options || {}),
  };
};

export var mapUserToTestDTO = (user: UserDocument) => ({
  name: user.name,
  about: user.about,
  avatar: user.avatar,
  email: user.email,
  _id: user._id.toString(),
});

export var createUser = async (options = {}) =>
  await User.create({
    ...randomeUser(options),
  });
