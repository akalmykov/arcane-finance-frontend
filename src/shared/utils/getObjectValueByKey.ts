export const getObjectValueByKey = (key: string, object: string) => {
    const regex = new RegExp(`${key}:\\s*(\\d+)u\\d+`);
    const result = object.match(regex);

    return result ? result[1] : null;
};
