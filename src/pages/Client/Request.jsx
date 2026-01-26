import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

function createData(eventTitle, dateRequested, status) {
  return { eventTitle, dateRequested, status };
}

const rows = [
  createData("Orientation Coverage", "2026-01-10", "Pending"),
  createData("Sports Fest", "2026-01-12", "Approved"),
  createData("Seminar Talk", "2026-01-15", "Rejected"),
];

export default function RequestsPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Page Header */}
      <header className="mb-6">
        <p className="text-sm text-gray-500">
          Manage and track all event coverage requests
        </p>
      </header>

      {/* Content Container */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <TableContainer component="div">
          <Table sx={{ minWidth: 650 }} aria-label="requests table">
            <TableHead>
              <TableRow>
                <TableCell>EVENT TITLE</TableCell>
                <TableCell>DATE REQUESTED</TableCell>
                <TableCell>STATUS</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td": { borderBottom: 0 } }}
                >
                  <TableCell>{row.eventTitle}</TableCell>
                  <TableCell>{row.dateRequested}</TableCell>
                  <TableCell>{row.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </section>
    </div>
  );
}
