// @flow
import * as React from 'react';
import { forwardRef, useImperativeHandle, useState } from 'react';

import { ROOT_LOCALITY_NAME } from '../../../constants';

import BackendAwareDndProvider from '../../../wrapper/dnd-provider';

import LocalityDrop from './locality.drop';

export type localityDropListPropTypes = {
  addLocality: (parent: Locality) => void,
  onLocalitySelect: (locality: Locality) => void,
  project: Project,
  projectLocalities: Locality[],
};

export const LocalityDropList = forwardRef(
  ({ addLocality, onLocalitySelect, project, projectLocalities }: localityDropListPropTypes, ref): React.Element<'div'> => {
    const [localityIdIndices, setLocalityIdIndices] = useState([]);

    useImperativeHandle(ref, () => ({
      rebuildLocalityIdIndices,
    }));

    const rebuildLocalityIdIndices = (selectedLocality: Locality) => {
      setLocalityIdIndices(buildLocalityIdIndices(localityIdIndices, selectedLocality));
    };

    const renderLocalityDropList = () => {
      const existingLocalityIdIndices = [];
      return localityIdIndices.map((localityIndex, index) => {
        existingLocalityIdIndices.push(localityIndex);

        const localityAtIndex = resolveLocalityUsingIdIndices(projectLocalities, existingLocalityIdIndices);

        if (!localityAtIndex) {
          return null;
        }

        return (
          <div className="cell medium-4" key={index}>
            <LocalityDrop
              locality={localityAtIndex}
              childrenLocalities={localityAtIndex.children || []}
              addLocality={addLocality}
              onLocalitySelect={onLocalitySelect}
            />
          </div>
        );
      });
    };

    return (
      <div className="locality-drop-list grid-x grid-margin-x grid-margin-y">
        <BackendAwareDndProvider>
          <div className="cell medium-4">
            <LocalityDrop
              locality={{ name: ROOT_LOCALITY_NAME, project }}
              childrenLocalities={projectLocalities}
              addLocality={addLocality}
              onLocalitySelect={onLocalitySelect}
            />
          </div>

          {renderLocalityDropList()}
        </BackendAwareDndProvider>
      </div>
    );
  }
);

const buildLocalityIdIndices = (currentIdIndices: number[], newLocality: Locality): number[] => {
  if (!newLocality.parent) {
    return [newLocality.id];
  }

  let nextIndices;
  const matchIndex = currentIdIndices.findIndex(id => id === newLocality.parent.id);
  if (matchIndex !== -1) {
    nextIndices = currentIdIndices.slice(0, matchIndex + 1);
  } else {
    nextIndices = currentIdIndices.slice();
  }

  nextIndices.push(newLocality.id);

  return nextIndices;
};

const resolveLocalityUsingIdIndices = (projectLocalities: Locality[], localityIdIndices: number[]): Locality | undefined => {
  const locality = projectLocalities.find(projectLocality => projectLocality.id === localityIdIndices[0]);

  if (localityIdIndices.length === 1) {
    return locality;
  }

  return resolveLocalityUsingIdIndices(locality.children, localityIdIndices.slice(1, localityIdIndices.length));
};

export default LocalityDropList;
