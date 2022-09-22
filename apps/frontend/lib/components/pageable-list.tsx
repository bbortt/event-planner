import { Pagination } from 'react-bootstrap';

type PageableListProps = {
  children: React.ReactNode;
  number: number;
  totalPages: number;
};

function paginationItems(currentPage: number, totalPages: number) {
  let items = [];
  for (let number = 1; number <= totalPages; number++) {
    items.push(
      <Pagination.Item key={number} active={number === currentPage}>
        {number}
      </Pagination.Item>
    );
    return items;
  }
}

const PageableList = ({ children, number, totalPages }: PageableListProps) => {
  return (
    <>
      {children}

      <Pagination>{paginationItems(number, totalPages)}</Pagination>
    </>
  );
};

export default PageableList;
