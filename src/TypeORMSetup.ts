import ormconfigJSON from '../ormconfig.json';

const ormconfigFiles: { [k: string]: typeof ormconfigJSON[number] } = {
    development: ormconfigJSON.find(c => c.name === 'dev')!
};

export const ORMCONFIG: Readonly<typeof ormconfigJSON[number]> = ormconfigFiles[process.env.NODE_ENV!];

if (!ORMCONFIG) {
    throw new Error('ORM Config not found for NODE_ENV=' + process.env.NODE_ENV);
}

export const ORMCONFIG_NAME: string = ORMCONFIG.name;