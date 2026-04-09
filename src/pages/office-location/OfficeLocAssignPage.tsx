import Button from "@/components/fragment/button/button";
import Input from "@/components/fragment/input/input";
import Table from "@/components/fragment/table/table";
import Title from "@/components/layout/Title";
import { Field, FieldLabel } from "@/components/ui/field";
import { useGetEmployee } from "@/hooks/feature/use-employee";
import {
  useGetDetailOfficeLoc,
  useOfficeLocAssignEmployee,
} from "@/hooks/feature/use-office-location";
import type { SearchEmployeeRequest } from "@/lib/model/employee.model";
import { ArrowLeft } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { useLocalStorage } from "react-use";

export default function OfficeLocAssignPage(): React.ReactNode {
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [key, setKey] = useState<string>("");
  const [employeeID, setEmpoyeeID] = useState<string>("");
  const { officeLocationID } = useParams();
  const [token] = useLocalStorage("token", "");

  const { data } = useGetDetailOfficeLoc(token, officeLocationID ?? "");

  const employeeSearch: SearchEmployeeRequest = {
    key: key,
    page: 1,
    size: 5,
  };
  const { data: employees, isLoading } = useGetEmployee(token, employeeSearch);

  const mutation = useOfficeLocAssignEmployee(token);

  const onSubmit = () => {
    if (employeeID === "") {
      alert("karyawan tidak ditemukan");
    }
    mutation.mutate({
      employee_id: employeeID,
      office_location_id: officeLocationID ?? "-",
    });
  };

  return (
    <>
      <Button asChild variant="third">
        <Link to="/attendances/office-locations">
          <ArrowLeft />
        </Link>
      </Button>

      <Title title={`${data?.name}`} />

      <hr className="my-6" />

      <div className="my-4">
        <div className="relative z-10">
          <Field>
            <FieldLabel>Tugaskan karyawan</FieldLabel>
            <Input
              value={key}
              label="Karyawan"
              type="text"
              onFocus={() => setFormOpen(true)}
              onBlur={() => setTimeout(() => setFormOpen(false), 150)}
              onChange={(e) => setKey(e)}
            />
          </Field>
        </div>

        {formOpen && key && (
          <div className="w-full shadow  pt-15 pb-4 rounded-2xl relative -top-10">
            {isLoading && <p>Searching ...</p>}
            {employees?.data.length === 0 && (
              <p className="px-4 text-gray-400 text-sm">Data tidak ditemukan</p>
            )}
            <div className="w-full space-y-1.5">
              {employees?.data.map((item) => (
                <div
                  key={item.id}
                  className="flex px-4 flex-col py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setKey(item.fullname);
                    setEmpoyeeID(item.id);
                  }}
                >
                  <p>{item.fullname}</p>
                  <span className="text-xs text-gray-400">
                    {item.employee_number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mb-5">
        <Button disabled={!employeeID} onClick={onSubmit}>
          Simpan
        </Button>
      </div>

      <Table
        data={data?.employees || []}
        keyExtractor={(row) => row.id}
        columns={[
          {
            header: "Nama",
            accessor: "fullname",
          },
          {
            header: "Action",
            accessor: () => (
              <div className="flex justify-end items-center gap-2">
                <Button variant="link" className="text-destructive! " asChild>
                  <Link to="/delete">Delete</Link>
                </Button>
              </div>
            ),
            className: "text-right",
          },
        ]}
      />
    </>
  );
}
