const dateConverter = (dateInSeconds: number): string => String(new Date(dateInSeconds * 1000))

export default dateConverter;