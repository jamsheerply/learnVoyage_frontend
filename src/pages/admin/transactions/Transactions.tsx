import { TransactionsTable } from "@/components/admin/transactions/transactionsTable";
import CourseFilter from "@/components/public/course/CourseFilter";
import { useDebounce } from "@/custom Hooks/hooks";
import { Input } from "@/shadcn/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shadcn/ui/pagination";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import axios, { AxiosInstance } from "axios";
import { Calendar, Download, ListFilter } from "lucide-react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Transactions() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedStatus, setSelectedStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const method = ["card", "upi"];
  const status = ["pending", "completed", "failed"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleMethodChange = (name: string) => {
    setSelectedMethod((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const handleStatusChange = (name: string) => {
    setSelectedStatus((prevState) => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const fetchTransactions = async () => {
    try {
      const selectedMethodIds = Object.keys(selectedMethod).filter(
        (key) => selectedMethod[key]
      );
      const selectedStatusIds = Object.keys(selectedStatus).filter(
        (key) => selectedStatus[key]
      );
      const baseURL = `${import.meta.env.VITE_BASE_URL}/payment-service`;
      const api: AxiosInstance = axios.create({
        baseURL: baseURL,
        withCredentials: true,
      });

      const response = await api.get("/read-payment", {
        params: {
          page,
          limit,
          search: debouncedSearch || "",
          method: selectedMethodIds.join(","),
          status: selectedStatusIds.join(","),
        },
      });
      if (response.data && response.data.data) {
        setTransactions(response.data.data.payments);
        setTotal(response.data.data.total);
      } else {
        console.error("Unexpected response format:", response);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, limit, debouncedSearch, selectedMethod, selectedStatus]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / limit);
  const handleDownload = async (format) => {
    try {
      const baseURL = `${import.meta.env.VITE_BASE_URL}/payment-service`;
      const api: AxiosInstance = axios.create({
        baseURL: baseURL,
        withCredentials: true,
      });

      const response = await api.get(`/download/${format}`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `transactions.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading transactions:", error);
    }
  };
  console.log("transactions", transactions);
  return (
    <>
      <div className="p-6">
        <div className=" flex justify-between">
          <h2 className="text-2xl font-semibold mb-4">Transactions</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-500" />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="border p-2 rounded"
              />
              <span>to</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="border p-2 rounded"
              />
            </div>
            <Menu>
              <MenuButton as={Button} rightIcon={<Download />}>
                Download
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleDownload("pdf")}>PDF</MenuItem>
                <MenuItem onClick={() => handleDownload("xlsx")}>
                  Excel
                </MenuItem>
              </MenuList>
            </Menu>
            <div>
              <Input
                placeholder="Search"
                className="border-2"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="bg-green-100 rounded-sm">
              <Button colorScheme="#dcfce7" onClick={onOpen}>
                <ListFilter className="cursor-pointer text-green-500 " />
              </Button>
            </div>
          </div>
        </div>
        <TransactionsTable transactions={transactions} />
        {total > limit && (
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                href="#"
              />
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                href="#"
              />
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Filter</DrawerHeader>

          <DrawerBody className="font-bold">
            <CourseFilter
              header="Method"
              data={method.map((method) => ({
                name: method,
                count: 0,
                id: method,
              }))}
              selectedItems={selectedMethod}
              onItemChange={handleMethodChange}
            />
            <CourseFilter
              header="Status"
              data={status.map((method) => ({
                name: method,
                count: 0,
                id: method,
              }))}
              selectedItems={selectedStatus}
              onItemChange={handleStatusChange}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Transactions;
