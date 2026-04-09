import Loader from "@/components/fragment/loader/loader";
import Title from "@/components/layout/Title";
import EmployeeList from "@/feature/employee/EmployeeList";
import EmployeeSearch from "@/feature/employee/EmployeeSearch";
import { useGetEmployee } from "@/hooks/feature/use-employee";
import { useDocumentTitle } from "@/hooks/user-titledoc";
import type { SearchEmployeeRequest } from "@/lib/model/employee.model";
import { useState } from "react";
import { useNavigate } from "react-router";

import { useLocalStorage } from "react-use";
import { toast } from "sonner";

export default function EmployeePage(): React.ReactNode {
  useDocumentTitle("Daftar Employee");
  const [token] = useLocalStorage("token", "");
  const [key, setKey] = useState<string>("");
  const [searchKey, setSearchKey] = useState<string>("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState("10");
  const navigate = useNavigate();
  const search: SearchEmployeeRequest = {
    key: searchKey,
    page,
    size: Number(size),
  };

  // Fetch employee data using the custom hook
  const { data, isError, error, isLoading } = useGetEmployee(
    token ?? "",
    search,
  );
  if (isError) {
    toast.error(error?.message || "Failed to fetch employee data");
  }

  // Handle search form submission
  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchKey(key);
    setPage(1);
    navigate(`?key=${key}&page=${page}&size=${size}`);
  }

  return (
    <div>
      <Title title="Data karyawan" />

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <EmployeeSearch
            handleSearch={handleSearch}
            searchKey={key}
            setKey={setKey}
          />
          <EmployeeList
            data={data}
            page={page}
            size={size}
            setPage={setPage}
            setSize={setSize}
          />
        </>
      )}
    </div>
  );
}
