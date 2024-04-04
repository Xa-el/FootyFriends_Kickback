// import type { PageLoad } from './$types';

// export const load = (async ({ params, fetch }) => {
export const load = (async () => {

     // await fetch(`someURL/${params.username}`);

     return {
          name: 'ryder keeney',
          age: 86,
          sex: false,
     };
});

// }) satisfies PageLoad;
