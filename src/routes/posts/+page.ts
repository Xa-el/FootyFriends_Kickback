// src/routes/posts/+page.ts
import { db } from '$lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ session }) => {
  // Assume the user ID is stored in the session
  const userId = session.user?.uid;

  if (!userId) {
    return {
      status: 302,
      redirect: '/login',
    };
  }

  const docRef = doc(db, "users", userId, "userProfile", "profileInfo");
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.log("No such document!");
    return { props: { profile: null } };
  }

  const profile = docSnap.data();
  return {
    props: {
      // Pass the profile data to the page
      profile,
    },
  };
};

