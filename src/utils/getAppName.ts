import packageJson from "../../package.json" assert { type: "json" };

export const getAppName = () => {
	const match = packageJson.name?.match(/^@(.+)\/.+$/);

	if (!match || !match[1]) {
		throw new Error(
			'Application name from the package.json was not found. Please, check the "name" field in the package.json file. It should match "@appName/appPart".'
		);
	}

	return match[1];
};
