import React from "react";
import classnames from "classnames";
import { usePagination, DOTS } from "./usePagination";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import "./pagination.scss";

type paginationPrototype = {
  onPageChange: (count: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  className: string;
};

const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className,
}: paginationPrototype) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return (
      <ul className="pagination-container">
        <li className="pagination-item selected">1</li>
      </ul>
    );
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul
      className={classnames("pagination-container", { [className]: className })}
    >
      {/* left arrow */}
      <li
        className={classnames("pagination-item", {
          disabled: currentPage === 1,
        })}
        onClick={onPrevious}
      >
        <div className="arrow left">
          <KeyboardArrowLeftRoundedIcon className="icon" />
        </div>
      </li>

      {/* page numbers */}
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <li key={index + 1} className="pagination-item dots">
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={index + 1}
            className={classnames("pagination-item number", {
              selected: pageNumber === currentPage,
            })}
            onClick={() => onPageChange(Number(pageNumber))}
          >
            {pageNumber}
          </li>
        );
      })}

      {/* right arrow */}
      <li
        className={classnames("pagination-item", {
          disabled: currentPage === lastPage,
        })}
        onClick={onNext}
      >
        <div className="arrow right">
          <ChevronRightRoundedIcon className="icon" />
        </div>
      </li>
    </ul>
  );
};

export default Pagination;
