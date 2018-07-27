import { merge, zip } from 'rxjs';
import { groupBy, mergeMap } from 'rxjs/operators';
import * as R from 'ramda';

const sync = (source1, source2, key) => {
  const labeledSource1 = source1.map(value => ({ value, first: true }));
  const labeledSource2 = source2.map(value => ({ value, first: false }));

  return merge(
    labeledSource1,
    labeledSource2
  ).pipe(
    groupBy(R.path(['value', key])),
    mergeMap(keyGroup => {
      const [
        keyGroup1,
        keyGroup2
      ] = keyGroup.partition(R.prop('first'));

      return zip(
        keyGroup1,
        keyGroup2,
        (obj1, obj2) => R.merge(obj1.value, obj2.value)
      );
    })
  );
}

const syncMany = (sources, key) => {
  return sources.reduce((acc, source) => sync(acc, source, key));
}
