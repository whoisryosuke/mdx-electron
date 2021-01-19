import React, { Suspense } from 'react';

interface Props {}

export const MDXPreview = ({ filename }: Props) => {
  console.log('loading preview for', filename);
  if (filename && filename !== '') {
    const MDXMagic = React.lazy(() => import(`../content/${filename}`));
    console.log('the mdx preview', MDXMagic);
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <MDXMagic />
      </Suspense>
    );
  }
  return <div>Select a file from the sidebar</div>;
};

export default MDXPreview;
