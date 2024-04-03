// src/routes/home/+page.ts
export const load = async () => {
    return {
        props: {
            name: 'Ryder',
            sex: false,
        },
    };
};
