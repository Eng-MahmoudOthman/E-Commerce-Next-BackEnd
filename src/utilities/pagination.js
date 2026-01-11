



export function getPaginationMetadata(total, currentPage = 1, limit = 10) {
   const numberOfPages = Math.max(1, Math.ceil(total / limit));

   const metadata = {
      currentPage,
      numberOfPages,
      limit,
   };

   if (currentPage < numberOfPages) {
      metadata.nextPage = currentPage + 1;
   }

   if (currentPage > 1) {
      metadata.prevPage = currentPage - 1;
   }

   return metadata;
}
