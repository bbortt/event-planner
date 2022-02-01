// @flow
import * as React from 'react';

export const renderFoundationNode = (
  node: React.ElementRef<React.ElementType> | null,
  callback?: () => void
): React.ElementRef<React.ElementType> | null => {
  if (typeof window === 'undefined' || typeof jQuery === 'undefined' || !node) {
    return;
  }

  import('foundation-sites')
    .then(() => {
      // $FlowFixMe
      jQuery(node ? node : document).foundation();

      if (callback) {
        callback();
      }
    })
    .catch(() => {});
};

export default renderFoundationNode;
