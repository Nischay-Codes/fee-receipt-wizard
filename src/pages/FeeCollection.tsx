import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, CreditCard, FileText, Check, Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock student database
const mockStudents = {
  "ST001": {
    id: "ST001",
    name: "Aarav Kumar",
    course: "B.Tech Computer Science",
    semester: "4th Semester",
    rollNo: "2022CSE001",
    contact: "+91 98765 43210",
    email: "aarav.kumar@college.edu"
  },
  "ST002": {
    id: "ST002",
    name: "Priya Sharma",
    course: "MBA Finance",
    semester: "2nd Semester",
    rollNo: "2023MBA045",
    contact: "+91 98765 43211",
    email: "priya.sharma@college.edu"
  },
  "ST003": {
    id: "ST003",
    name: "Rohan Patel",
    course: "B.Sc Mathematics",
    semester: "6th Semester",
    rollNo: "2021BSC023",
    contact: "+91 98765 43212",
    email: "rohan.patel@college.edu"
  }
};

const feeCategories = [
  { value: "tuition", label: "Tuition Fee" },
  { value: "library", label: "Library Fee" },
  { value: "exam", label: "Examination Fee" },
  { value: "sports", label: "Sports Fee" },
  { value: "hostel", label: "Hostel Fee" },
  { value: "other", label: "Other" }
];

interface Receipt {
  receiptNo: string;
  date: string;
  studentId: string;
  studentName: string;
  course: string;
  rollNo: string;
  feeType: string;
  amount: number;
  paymentMode: string;
}

const FeeCollection = () => {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState<typeof mockStudents[keyof typeof mockStudents] | null>(null);
  const [feeType, setFeeType] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const handleSearchStudent = () => {
    const foundStudent = mockStudents[studentId as keyof typeof mockStudents];
    if (foundStudent) {
      setStudent(foundStudent);
      toast({
        title: "Student Found",
        description: `${foundStudent.name} details loaded successfully.`,
      });
    } else {
      setStudent(null);
      toast({
        title: "Student Not Found",
        description: "Please check the student ID and try again.",
        variant: "destructive",
      });
    }
  };

  const handlePayment = () => {
    if (!student || !feeType || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newReceipt: Receipt = {
      receiptNo: `RCP${Date.now().toString().slice(-8)}`,
      date: new Date().toLocaleString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      studentId: student.id,
      studentName: student.name,
      course: student.course,
      rollNo: student.rollNo,
      feeType: feeCategories.find(cat => cat.value === feeType)?.label || feeType,
      amount: parseFloat(amount),
      paymentMode: paymentMode.toUpperCase()
    };

    setReceipt(newReceipt);
    setShowReceipt(true);
    
    toast({
      title: "Payment Successful",
      description: `Fee payment of ₹${amount} recorded successfully.`,
    });

    // Reset form
    setAmount("");
    setFeeType("");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Fee Collection System
          </h1>
          <p className="text-muted-foreground">College ERP - Financial Management</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Search Section */}
          <Card className="shadow-[var(--shadow-card)] border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Student Lookup
              </CardTitle>
              <CardDescription>Enter student ID to fetch details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="studentId"
                    placeholder="e.g., ST001, ST002"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchStudent()}
                  />
                  <Button onClick={handleSearchStudent} className="bg-gradient-to-r from-primary to-primary/90">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {student && (
                <div className="space-y-3 p-4 bg-secondary/50 rounded-lg border border-border animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <div className="flex items-center gap-1 text-accent">
                      <Check className="w-4 h-4" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Roll No</p>
                      <p className="font-medium">{student.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Course</p>
                      <p className="font-medium">{student.course}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Semester</p>
                      <p className="font-medium">{student.semester}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Contact</p>
                      <p className="font-medium">{student.contact}</p>
                    </div>
                  </div>
                </div>
              )}

              {!student && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Enter a student ID to view details</p>
                  <p className="text-xs mt-1">Try: ST001, ST002, or ST003</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fee Payment Section */}
          <Card className="shadow-[var(--shadow-card)] border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-accent" />
                Fee Payment
              </CardTitle>
              <CardDescription>Enter fee details and process payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feeType">Fee Category</Label>
                <Select value={feeType} onValueChange={setFeeType}>
                  <SelectTrigger id="feeType">
                    <SelectValue placeholder="Select fee category" />
                  </SelectTrigger>
                  <SelectContent>
                    {feeCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMode">Payment Mode</Label>
                <Select value={paymentMode} onValueChange={setPaymentMode}>
                  <SelectTrigger id="paymentMode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handlePayment} 
                disabled={!student || !feeType || !amount}
                className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent/80"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark as Paid
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Receipt Dialog */}
        <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Payment Receipt</DialogTitle>
            </DialogHeader>
            {receipt && (
              <div id="receipt" className="space-y-4 print:p-8">
                <div className="bg-gradient-to-r from-primary to-accent p-6 rounded-t-lg text-white text-center">
                  <h2 className="text-2xl font-bold">College ERP</h2>
                  <p className="text-sm opacity-90">Fee Payment Receipt</p>
                </div>
                
                <div className="p-6 space-y-4 bg-card rounded-b-lg shadow-[var(--shadow-receipt)]">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Receipt No.</p>
                      <p className="font-mono font-bold">{receipt.receiptNo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Date & Time</p>
                      <p className="text-sm font-medium">{receipt.date}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Student Name</p>
                      <p className="font-semibold">{receipt.studentName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Student ID</p>
                        <p className="font-medium">{receipt.studentId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Roll No</p>
                        <p className="font-medium">{receipt.rollNo}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Course</p>
                      <p className="font-medium">{receipt.course}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fee Type</span>
                      <span className="font-medium">{receipt.feeType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Mode</span>
                      <span className="font-medium">{receipt.paymentMode}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <span className="font-semibold">Total Amount</span>
                      <span className="text-2xl font-bold text-accent">₹{receipt.amount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-accent">Payment Confirmed</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handlePrint} className="w-full print:hidden" variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt, #receipt * {
            visibility: visible;
          }
          #receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default FeeCollection;
