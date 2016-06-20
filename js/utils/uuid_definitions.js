/* Copyright (c) 2016 Nordic Semiconductor. All Rights Reserved.
 *
 * The information contained herein is property of Nordic Semiconductor ASA.
 * Terms and conditions of usage are described in detail in NORDIC
 * SEMICONDUCTOR STANDARD SOFTWARE LICENSE AGREEMENT.
 *
 * Licensees are granted free, non-transferable use of the information. NO
 * WARRANTY of ANY KIND is provided. This heading must NOT be removed from
 * the file.
 *
 */

 'use strict';

import * as Definitions from './definitions';
import remote from 'remote';
import path from 'path';
import fs from 'fs';

let dataFileDir = remote.getGlobal('dataFileDir');

var data = fs.readFileSync(path.join(dataFileDir, 'uuid_definitions.json'), 'utf-8');
var RemoteDefinitions;

try {
    RemoteDefinitions = JSON.parse(data);
}
catch (err) {
    console.log('Error loading user defined UUID\'s ', err);
}

export const uuid16bitDefinitions = Object.assign({},
    Definitions.uuid16bitServiceDefinitions,
    Definitions.uuid16bitCharacteristicDefinitions,
    Definitions.uuid16bitDescriptorDefinitions,
    Definitions.uuid16bitGattDefinitions,
    RemoteDefinitions.uuid16bitServiceDefinitions,
    RemoteDefinitions.uuid16bitCharacteristicDefinitions,
    RemoteDefinitions.uuid16bitDescriptorDefinitions,
    RemoteDefinitions.uuid16bitGattDefinitions);

export const uuid128bitDescriptorDefinitions = Object.assign({},
    RemoteDefinitions.uuid128bitDescriptorDefinitions);

export const uuid128bitDefinitions = Object.assign({},
    Definitions.uuid128bitServiceDefinitions,
    Definitions.uuid128bitCharacteristicDefinitions,
    RemoteDefinitions.uuid128bitServiceDefinitions,
    RemoteDefinitions.uuid128bitCharacteristicDefinitions,
    uuid128bitDescriptorDefinitions);

export const uuidServiceDefinitions = Object.assign({},
    Definitions.uuid16bitServiceDefinitions,
    Definitions.uuid128bitServiceDefinitions,
    RemoteDefinitions.uuid16bitServiceDefinitions,
    RemoteDefinitions.uuid128bitServiceDefinitions);

export const uuidCharacteristicDefinitions = Object.assign({},
    Definitions.uuid16bitCharacteristicDefinitions,
    Definitions.uuid128bitCharacteristicDefinitions,
    RemoteDefinitions.uuid16bitCharacteristicDefinitions,
    RemoteDefinitions.uuid128bitCharacteristicDefinitions);

export const uuidDescriptorDefinitions = Object.assign({},
    Definitions.uuid16bitDescriptorDefinitions,
    RemoteDefinitions.uuid16bitDescriptorDefinitions,
    uuid128bitDescriptorDefinitions);

export const uuidDefinitions = Object.assign({},
    uuid16bitDefinitions,
    uuid128bitDefinitions);

// TODO: look into using a database for storing the services UUID's. Also look into importing them from the Bluetooth pages.
// TODO: Also look into reusing code from the Android MCP project:
// TODO: http://projecttools.nordicsemi.no/stash/projects/APPS-ANDROID/repos/nrf-master-control-panel/browse/app/src/main/java/no/nordicsemi/android/mcp/database/init
// TODO: http://projecttools.nordicsemi.no/stash/projects/APPS-ANDROID/repos/nrf-master-control-panel/browse/app/src/main/java/no/nordicsemi/android/mcp/database/DatabaseHelper.java
export function getUuidName(uuid) {
    let lookupUuid = uuid.toUpperCase();
    if (lookupUuid[1] === 'X') {
        lookupUuid = lookupUuid.slice(2);
    }

    if (uuidDefinitions[lookupUuid])
    {
        return uuidDefinitions[lookupUuid].name;
    }

    return uuid;
}

export function getUuidByName(name) {
    for (let uuid in uuidDefinitions) {
        if (uuidDefinitions.hasOwnProperty(uuid)) {
            if (uuidDefinitions[uuid].name === name) {
                return uuid;
            }
        }
    }
}

export function getPrettyUuid(uuid) {
    const insertHyphen = (string, index) => {
        return string.substr(0, index) + '-' + string.substr(index);
    };

    if (uuid.length === 4) {
        return uuid.toUpperCase();
    }

    uuid = insertHyphen(uuid, 20);
    uuid = insertHyphen(uuid, 16);
    uuid = insertHyphen(uuid, 12);
    uuid = insertHyphen(uuid, 8);

    return uuid.toUpperCase();
}

export function getUuidFormat(uuid) {
    if (!uuid) { return Definitions.NO_FORMAT; }

    let lookupUuid = uuid.toUpperCase();
    if (lookupUuid[1] === 'X') {
        lookupUuid = lookupUuid.slice(2);
    }

    if (uuidDefinitions[lookupUuid])
    {
        return uuidDefinitions[lookupUuid].format;
    }

    return Definitions.NO_FORMAT;
}
