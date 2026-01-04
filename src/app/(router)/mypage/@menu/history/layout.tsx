import React from 'react';

export default function HistoryLayout({
  children,
  review,
}: {
  children: React.ReactNode;
  review: React.ReactNode;
}) {
  return (
    <>
      {children}
      {review}
    </>
  );
}
