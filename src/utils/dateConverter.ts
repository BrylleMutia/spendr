const dateConverter = (dateInSeconds: number): string =>
  String(new Date(dateInSeconds * 1000));

const dateConvertMonthYear = (dateConvert: string) => {
  const newDate = new Date(dateConvert);
  const datemmyyyy = `${newDate.getMonth()}/${newDate.getFullYear()}`;

  return datemmyyyy;
};

const currentDateMonthYear = (monthModifier: number = 0) => {
   const newDate = new Date();
   const datemmyyyy = `${
      newDate.getMonth() - monthModifier
   }/${newDate.getFullYear()}`;
   
  return datemmyyyy;
};

export { dateConvertMonthYear, currentDateMonthYear };
export default dateConverter;
