/* tslint:disable */
/* eslint-disable */
/**
 * Event-Planner
 * The Event-Planner REST API definition
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: timon.borter@gmx.ch
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { Project } from './Project';
import {
    ProjectFromJSON,
    ProjectFromJSONTyped,
    ProjectToJSON,
} from './Project';

/**
 * 
 * @export
 * @interface ReadProjects200Response
 */
export interface ReadProjects200Response {
    /**
     * 
     * @type {Array<Project>}
     * @memberof ReadProjects200Response
     */
    contents?: Array<Project>;
    /**
     * 
     * @type {number}
     * @memberof ReadProjects200Response
     */
    totalElements?: number;
    /**
     * 
     * @type {number}
     * @memberof ReadProjects200Response
     */
    totalPages?: number;
    /**
     * 
     * @type {number}
     * @memberof ReadProjects200Response
     */
    number?: number;
}

/**
 * Check if a given object implements the ReadProjects200Response interface.
 */
export function instanceOfReadProjects200Response(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ReadProjects200ResponseFromJSON(json: any): ReadProjects200Response {
    return ReadProjects200ResponseFromJSONTyped(json, false);
}

export function ReadProjects200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): ReadProjects200Response {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'contents': !exists(json, 'contents') ? undefined : ((json['contents'] as Array<any>).map(ProjectFromJSON)),
        'totalElements': !exists(json, 'totalElements') ? undefined : json['totalElements'],
        'totalPages': !exists(json, 'totalPages') ? undefined : json['totalPages'],
        'number': !exists(json, 'number') ? undefined : json['number'],
    };
}

export function ReadProjects200ResponseToJSON(value?: ReadProjects200Response | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'contents': value.contents === undefined ? undefined : ((value.contents as Array<any>).map(ProjectToJSON)),
        'totalElements': value.totalElements,
        'totalPages': value.totalPages,
        'number': value.number,
    };
}

