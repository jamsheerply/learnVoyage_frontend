import React from "react";
import { BarChart, Bar } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";

const data = [
  {
    name: "Adobe XD Part 01",
    sale: "7 ($294.00)",
    pass: "6 ($1.20)",
    like: 35,
    comment: 61,
  },
  {
    name: "UI / UX Design",
    sale: "4 ($77.00)",
    pass: "8 ($4.80)",
    like: 44,
    comment: 56,
  },
  {
    name: "Mockplus Blog",
    sale: "7 ($294.00)",
    pass: "16 ($8.50)",
    like: 68,
    comment: 65,
  },
  {
    name: "User Stack Exchange",
    sale: "7 ($294.00)",
    pass: "37 ($28.40)",
    like: 32,
    comment: 98,
  },
  {
    name: "Adobe Photoshop CC",
    sale: "7 ($294.00)",
    pass: "17 ($8.60)",
    like: 98,
    comment: 20,
  },
];

// const latestSales = [
//   { name: "Machine Learning", category: "Data Science", amount: 232 },
//   { name: "Machine Learning", category: "Data Science", amount: 232 },
//   { name: "Machine Learning", category: "Data Science", amount: 232 },
//   { name: "Machine Learning", category: "Data Science", amount: 232 },
// ];

// const projectPerformance = [
//   { name: "Adobe XD Part 01", category: "UI/UX Design" },
//   { name: "Adobe XD Part 02", category: "UI/UX Design" },
// ];

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 md:p-6 bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">832</div>
            <BarChart
              width={100}
              height={40}
              data={[
                { value: 400 },
                { value: 300 },
                { value: 200 },
                { value: 278 },
                { value: 189 },
              ]}
            >
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <div className="text-green-500">
              <TrendingUp size={24} />
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$89,832</div>
            <BarChart
              width={100}
              height={40}
              data={[
                { value: 400 },
                { value: 300 },
                { value: 200 },
                { value: 278 },
                { value: 189 },
              ]}
            >
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>My Recent Courses</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Sale</TableHead>
                    <TableHead>Pass</TableHead>
                    <TableHead>Like</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sale}</TableCell>
                      <TableCell>{item.pass}</TableCell>
                      <TableCell>{item.comment}</TableCell>
                      <TableCell>
                        <BarChart
                          width={100}
                          height={40}
                          data={[
                            { value: 400 },
                            { value: 300 },
                            { value: 200 },
                            { value: 278 },
                            { value: 189 },
                          ]}
                        >
                          <Bar dataKey="value" fill="#22c55e" />
                        </BarChart>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* <div className="space-y-4"> */}
        {/* <Card>
            <CardHeader>
              <CardTitle>Latest Sale</CardTitle>
            </CardHeader>
            <CardContent>
              {latestSales.map((sale, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-2"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-md mr-2"></div>
                    <div>
                      <div className="font-medium">{sale.name}</div>
                      <div className="text-sm text-gray-500">
                        {sale.category}
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md">
                    {sale.amount}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card> */}

        {/* <Card>
            <CardHeader>
              <CardTitle>Project Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {projectPerformance.map((project, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between mb-2"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-md mr-2"></div>
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-gray-500">
                        {project.category}
                      </div>
                    </div>
                  </div>
                  <BarChart
                    width={100}
                    height={40}
                    data={[
                      { value: 400 },
                      { value: 300 },
                      { value: 200 },
                      { value: 278 },
                      { value: 189 },
                    ]}
                  >
                    <Bar dataKey="value" fill="#22c55e" />
                  </BarChart>
                </div>
              ))}
            </CardContent>
          </Card> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
