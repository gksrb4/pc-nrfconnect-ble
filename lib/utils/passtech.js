
export function getVersion(macSpData) {
    const version = macSpData.slice(macSpData.length - 3, macSpData.length);
    return `${version[0]}.${version[1]}.${version[2]}`;
}

export function getNumber(byte1, byte2) {
    // little-edien
    return ((byte2 << 8) | byte1); // eslint-disable-line no-bitwise
}

export class PasstechDevice {
    constructor(macSpData) {
        if (macSpData.length <= 3) {
            throw new Error('Not Passtech Device!');
        }
        const [macId1, macId2, version] = macSpData;
        if (!(macId1 === 0xff && macId2 === 0xff)) {
            throw new Error('Not Passtech Device!');
        }
        if (version === 2 && macSpData.length !== 17) {
            throw new Error('Not Passtech Device!');
        }
        this.version = version;
        const [
            a, b, c, type, project1, project2, vendor1, vendor2,
            site1, site2, building, group, main1, main2,
            fwVerMajor, fwVerMid, fwVerMinor] = macSpData;
        // console.log(a, b, c);
        switch (this.version) {
            case 1:
                break;
            case 2:
                this.type = type;
                this.project = getNumber(project1, project2);
                this.vendor = getNumber(vendor1, vendor2);
                this.site = getNumber(site1, site2);
                this.building = building;
                this.group = group;
                this.main = getNumber(main1, main2);
                this.fwVersion = `${fwVerMajor}.${fwVerMid}.${fwVerMinor}`;
                break;
            default:
                throw new Error('Not valid Parameter');
        }
    }

    getFullName() {
        return `${this.building}-${this.group}-${this.main}-V${this.fwVersion}`;
    }
}
