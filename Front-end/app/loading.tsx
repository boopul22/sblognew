import Spinner from '../components/Spinner';
import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Spinner />
    </div>
  );
}
