function ModelValidate() {}

ModelValidate.prototype.url = (url: string) => {
  const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+[^\s]*$/i;

  return urlRegex.test(url);
};

ModelValidate.prototype.email = (email: string) => {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return emailRegex.test(email);
};

ModelValidate.prototype.name = (name: string) => {
  const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s-]+$/;

  return nameRegex.test(name);
};

// @ts-ignore
export var modelValidate = new ModelValidate();
