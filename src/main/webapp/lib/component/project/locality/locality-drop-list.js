// @flow
import * as React from 'react';

import { ROOT_LOCALITY_NAME } from '../../../constants';

import BackendAwareDndProvider from '../../../wrapper/dnd-provider';

import LocalityDrop from './locality.drop';
import Callout from '../../../foundation/callout';

export type localityDropListPropTypes = {
  addLocality: (parent: Locality) => void,
  localityIdIndices: string[],
  onLocalitySelect: (locality: Locality) => void,
  project: Project,
  projectLocalities: Locality[],
};

export const LocalityDropList = ({
  addLocality,
  localityIdIndices,
  onLocalitySelect,
  project,
  projectLocalities,
}: localityDropListPropTypes): React.Element<'div'> => {
  const existingLocalityIdIndices = [];

  return (
    <div className="locality-drop-list grid-x grid-margin-x grid-margin-y">
      <BackendAwareDndProvider>
        <div className="cell medium-4">
          <LocalityDrop
            locality={{ id: '', name: ROOT_LOCALITY_NAME, children: [], project }}
            childrenLocalities={projectLocalities}
            addLocality={addLocality}
            onLocalitySelect={onLocalitySelect}
          />
        </div>

        {localityIdIndices.map((localityIndex, index) => {
          existingLocalityIdIndices.push(localityIndex);
          const localityAtIndex = resolveLocalityUsingIdIndices(projectLocalities, existingLocalityIdIndices);

          return (
            <div className="cell medium-4" key={index}>
              {localityAtIndex ? (
                <LocalityDrop
                  locality={localityAtIndex}
                  childrenLocalities={localityAtIndex.children || []}
                  addLocality={addLocality}
                  onLocalitySelect={onLocalitySelect}
                />
              ) : (
                <Callout type="warning">
                  <h5>Da isch öpis falsch glofä.</h5>
                  <p>Due doch d Sitä mal neu Ladä!</p>
                </Callout>
              )}
            </div>
          );
        })}
      </BackendAwareDndProvider>
    </div>
  );
};

const resolveLocalityUsingIdIndices = (projectLocalities: Locality[], localityIdIndices: string[]): ?Locality => {
  const locality = projectLocalities.find(projectLocality => projectLocality.id === localityIdIndices[0]);
  if (!locality) {
    return;
  }

  if (localityIdIndices.length === 1) {
    return locality;
  }

  return resolveLocalityUsingIdIndices(locality.children, localityIdIndices.slice(1, localityIdIndices.length));
};

export default LocalityDropList;
