import React from 'react';

interface TagProps {
  name: string;
}

const Tag: React.FC<TagProps> = ({ name }) => {
  return (
    <span 
      className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary dark:bg-dark-primary/20 dark:text-dark-primary"
    >
      {name}
    </span>
  );
};

export default Tag;