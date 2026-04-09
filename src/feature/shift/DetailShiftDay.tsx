import Button from "@/components/fragment/button/button";
import Table from "@/components/fragment/table/table";
import { days } from "@/lib/data";
import type { ShiftDay } from "@/lib/model/shift.model";
import type React from "react";
import { useState } from "react";

interface Props {
  shifDays: ShiftDay[];
  shifName: string;
}

export default function DetailShifDay({
  shifDays,
  shifName,
}: Props): React.ReactNode {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(!isOpen)}>
        Detail Shif
      </Button>
      {isOpen && (
        <div
          className="fixed z-[999] w-full h-full top-0 left-0 bg-black/20 flex justify-center items-center"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-fit h-fit bg-white flex flex-col justify-start items-start rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-semibold text-xl mb-6">
              Pola kerja {shifName}
            </h2>
            <Table
              data={shifDays}
              columns={[
                {
                  header: "Hari",
                  accessor: (row) => {
                    const weekday = row.weekday ?? 1;
                    return (
                      <span className="font-semibold">{days[weekday - 1]}</span>
                    );
                  },
                },
                {
                  header: "Pola kerja",
                  accessor: (row) => (
                    <div>
                      {row.day_type === "workday" ? (
                        <span>Hari Kerja</span>
                      ) : (
                        <span className="text-gray-300">Bukan hari kerja</span>
                      )}
                    </div>
                  ),
                },
                {
                  header: "Jam masuk",
                  accessor: (row) => (
                    <>
                      {row.check_in ? (
                        <span className="font-medium tracking-widest">
                          {new Date(row.check_in ?? 0).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </>
                  ),
                },
                {
                  header: "Jam keluar",
                  accessor: (row) => (
                    <>
                      {row.check_out ? (
                        <span className="font-medium tracking-widest">
                          {new Date(row.check_out ?? 0).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </>
                  ),
                },
                {
                  header: "Mulai istirahat",
                  accessor: (row) => (
                    <>
                      {row.break_start ? (
                        <span className="font-medium tracking-widest">
                          {new Date(row.break_start ?? 0).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            },
                          )}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </>
                  ),
                },
                {
                  header: "Selasai istirahat",
                  accessor: (row) => (
                    <>
                      {row.break_end ? (
                        <span className="font-medium tracking-widest">
                          {new Date(row.break_end ?? 0).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </>
                  ),
                },
                {
                  header: "Maks. Istirahat",
                  accessor: (row) => (
                    <>
                      {row.max_break_minutes === 0 ? (
                        <span className="text-gray-300">
                          {row.max_break_minutes}
                        </span>
                      ) : (
                        <span>{row.max_break_minutes}</span>
                      )}
                    </>
                  ),
                },
              ]}
            />
          </div>
        </div>
      )}
    </>
  );
}
