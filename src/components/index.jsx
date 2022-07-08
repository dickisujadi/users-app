import React from "react";
import DataTable from "react-data-table-component";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap/dist/css/bootstrap.css";
import "../index.css";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  TextField
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import * as SERVICE from "../store/service";

const rowsInPage = 5;
const defaultPayload = new Payload({ page: "1", pageSize: rowsInPage, results: "10" });

function loopPages(pages) {
    const results = [];

    for (let i = 1; i < pages + 1; i++) {
        results.push(i);
    }

    return results;
}

function Payload({page, pageSize, results, gender, keyword, sortBy, sortOrder}) {
  this.page = page ? page : "1";
  this.pageSize = pageSize ? pageSize : rowsInPage;
  this.results = results ? results : "10";
  this.gender = gender ? gender : "";
  this.keyword = keyword ? keyword : "";
  this.sortBy = sortBy ? sortBy : "";
  this.sortOrder = sortOrder ? sortOrder : "";
}

export default function Index(props) {

    const BootyPagination = ({ rowsPerPage, rowCount, onChangePage, onChangeRowsPerPage, currentPage }) => {
      var payloadRef;

      const handleChangePayload = (value) => {
        payloadRef = new Payload({...payload, page: value});
        setPayload(payloadRef);
      }

      const handleBackButtonClick = () => {
          onChangePage(currentPage - 1);
          handleChangePayload(currentPage - 1);
      };

      const handleNextButtonClick = () => {
          onChangePage(currentPage + 1);
          handleChangePayload(currentPage + 1);
      };

      const handlePageNumber = (e) => {
          onChangePage(Number(e.target.value));
          handleChangePayload(e.target.value);
      };

      const pages = Math.ceil(rowCount / rowsPerPage);
      const pageItems = loopPages(pages);
      const nextDisabled = currentPage === pageItems.length;
      const previosDisabled = currentPage === 1;

      return (
            <nav className="pagination-container">
                <ul className="pagination">
                    <li className="border">
                        <button
                            className="page-link"
                            onClick={handleBackButtonClick}
                            disabled={previosDisabled}
                            aria-disabled={previosDisabled}
                            aria-label="previous page"
                        >
                            {"<"}
                        </button>
                    </li>
                    {pageItems.map((page) => {
                    const className =
                        page === currentPage ? "border border-primary" : "border";

                    return (
                        <li key={page} className={className}>
                            <button
                                className="page-link"
                                onClick={handlePageNumber}
                                value={page}
                            >
                                {page}
                            </button>
                        </li>
                    );
                    })}
                    <li className="border">
                        <button
                            className="page-link"
                            onClick={handleNextButtonClick}
                            disabled={nextDisabled}
                            aria-disabled={nextDisabled}
                            aria-label="next page"
                        >
                            {">"}
                        </button>
                    </li>
                </ul>
            </nav>
        );
    };

    var columnsArray = [
        {
        name: "Username",
        selector: (row) => row.username
        // sortable: true
        },
        {
        name: "Name",
        selector: (row) => row.name,
        // sortable: true
        options: {
            sort: true
        }
        },
        {
        name: "Email",
        selector: (row) => row.email,
        sortable: true
        },
        {
        name: "Gender",
        selector: (row) => row.gender,
        sortable: true
        },
        {
        name: "Registered Date",
        selector: (row) => row.registered_date,
        sortable: true
        }
    ];

    const columns = columnsArray;
    const [data, setData] = React.useState([]);
    const [users, setUsers] = React.useState([]);

    const genderArray = ["All", "Female", "Male"];
    const [selectedGender, setSelectedGender] = React.useState("All");

    const [searchValue, setSearchValue] = React.useState("");
    const [payload, setPayload] = React.useState(defaultPayload);

    React.useEffect(() => {
      fetchData(payload);
    }, [payload]);

    const fetchData = (payload) => {
      SERVICE.fetchUsers(payload).then((data) => {
        setUsers(data ? JSON.parse(data) : "no data found");
      });
    };

    const handleSearchFilter = (value) => {
      value = value.toLowerCase();
      var payloadRef = new Payload({...payload, keyword: value});
      setPayload(payloadRef);
    };

    const handleRefresh = () => {
      setSelectedGender("All");
      setSearchValue("");
      setPayload(defaultPayload);
    };

    const handleGenderFilter = React.useCallback((value) => {
      setSelectedGender(value);

      value = value.toLowerCase();
      var payloadRef = {};
      if (value !== "all") {
          payloadRef = new Payload({...payload, gender: value});
      } else {
          payloadRef = new Payload({...payload, gender: ""});
      }
      setPayload(payloadRef);
      },
      [payload]
    );

    React.useEffect(() => {
        if (users && users.status === 200) {
        const dataObj = [];
        users.data.results.forEach((result, idx) => {
            const registered_date = new Date(result.registered.date);
            let date = registered_date.getDate();
            let month = registered_date.getMonth();
            let year = registered_date.getFullYear();
            let hour = registered_date.getHours();
            let minute = registered_date.getMinutes();

            date = date < 10 ? "0" + date : date;
            month = month < 10 ? "0" + month : month;
            hour = hour < 10 ? "0" + hour : hour;
            minute = minute < 10 ? "0" + minute : minute;

            const registered_date_str = `${date}-${month}-${year} ${hour}:${minute}`;
            const obj = {
            username: result.login.username,
            name: `${result.name.first} ${result.name.last}`,
            email: result.email,
            gender: result.gender,
            registered_date: registered_date_str
            };
            dataObj.push(obj);
        });
        setData(dataObj);
        }
    }, [users]);

  return (
    <div>
      <Grid container className="App">
        <Grid item xs={12} sm={12}>
          <Grid container spacing={1} className="filter-group">
            <Grid item xs={2} sm={2}>
              <TextField
                // variant="outlined"
                label="Search"
                variant="outlined"
                value={searchValue}
                onChange={(event) => {
                  setSearchValue(event.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton
                        onClick={() => {
                          handleSearchFilter(searchValue);
                        }}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={2} sm={2}>
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{"Gender"}</InputLabel>
                  <Select
                    value={`${selectedGender}`}
                    label="Gender"
                    onChange={(event) => handleGenderFilter(event.target.value)}
                  >
                    {genderArray &&
                      genderArray.length &&
                      genderArray.map((item) => {
                        return <MenuItem value={item}>{item}</MenuItem>;
                      })}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={2} sm={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  handleRefresh();
                }}
              >
                Refresh Filter
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} className="card">
          <DataTable
            // title="Movies"
            columns={columns}
            data={data}
            defaultSortFieldID={0}
            pagination
            paginationComponent={BootyPagination}
            paginationPerPage={rowsInPage}
          />
        </Grid>
      </Grid>
    </div>
  );
}