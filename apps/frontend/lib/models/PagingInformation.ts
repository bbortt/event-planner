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
/**
 *
 * @export
 * @interface PagingInformation
 */
export interface PagingInformation {
  /**
   *
   * @type {Array<any>}
   * @memberof PagingInformation
   */
  contents?: Array<any>;
  /**
   *
   * @type {number}
   * @memberof PagingInformation
   */
  totalElements?: number;
  /**
   *
   * @type {number}
   * @memberof PagingInformation
   */
  totalPages?: number;
  /**
   *
   * @type {number}
   * @memberof PagingInformation
   */
  number?: number;
}

/**
 * Check if a given object implements the PagingInformation interface.
 */
export function instanceOfPagingInformation(value: object): boolean {
  let isInstance = true;

  return isInstance;
}

export function PagingInformationFromJSON(json: any): PagingInformation {
  return PagingInformationFromJSONTyped(json, false);
}

export function PagingInformationFromJSONTyped(json: any, ignoreDiscriminator: boolean): PagingInformation {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    contents: !exists(json, 'contents') ? undefined : json['contents'],
    totalElements: !exists(json, 'totalElements') ? undefined : json['totalElements'],
    totalPages: !exists(json, 'totalPages') ? undefined : json['totalPages'],
    number: !exists(json, 'number') ? undefined : json['number'],
  };
}

export function PagingInformationToJSON(value?: PagingInformation | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    contents: value.contents,
    totalElements: value.totalElements,
    totalPages: value.totalPages,
    number: value.number,
  };
}