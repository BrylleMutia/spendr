const dateConverter = (dateInSeconds: number): string =>
  String(new Date(dateInSeconds * 1000));

const dateConvertMonthYear = (dateConvert: string) => {
  const newDate = new Date(dateConvert);
  const datemmyyyy = `${newDate.getMonth()}/${newDate.getFullYear()}`;

  return datemmyyyy;
};

const dateConvertFullMonthYear = (dateConvert: string) => {
  const newDate = new Date(dateConvert);
  const datemmyyyy = `${newDate.toLocaleString("default", {
    month: "long",
  })} ${newDate.getFullYear()}`;

  return datemmyyyy;
};

const currentDateMonthYear = (monthModifier: number = 0) => {
  const newDate = new Date();
  const datemmyyyy = `${
    newDate.getMonth() - monthModifier
  }/${newDate.getFullYear()}`;

  return datemmyyyy;
};

export { dateConvertMonthYear, currentDateMonthYear, dateConvertFullMonthYear };
export default dateConverter;
