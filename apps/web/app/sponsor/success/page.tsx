"use client"

import React, { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Download, ArrowRight, ExternalLink, Copy, Check, FileText } from "lucide-react"
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer"

import Container from "@/components/shared/container"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card"
import { api } from "@/lib/api-client"

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 15,
  },
  orgTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#9f1239",
    marginBottom: 4,
  },
  receiptTitle: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 10,
    color: "#6b7280",
    marginTop: 2,
  },
  section: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4b5563",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  lastRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  label: {
    color: "#6b7280",
    fontSize: 11,
  },
  value: {
    color: "#111827",
    fontSize: 11,
    fontWeight: "bold",
  },
  txIdValue: {
    color: "#111827",
    fontSize: 10,
    fontFamily: "Courier",
    fontWeight: "bold",
  },
  linkValue: {
    color: "#9f1239",
    fontSize: 9,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    textAlign: "center",
  },
  footerText: {
    fontSize: 9,
    color: "#9ca3af",
  },
})

interface ReceiptPDFProps {
  tier: string
  amount: string
  currency: string
  txId: string
  date: string
  receiptUrl?: string | null
}

function SponsorshipReceiptPDF({ tier, amount, currency, txId, date, receiptUrl }: ReceiptPDFProps) {
  const currencySymbol = currency === "USD" ? "$" : "€"

  return (
    <Document title={`Sponsorship-Receipt-${txId}.pdf`}>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.orgTitle}>FCH Catechesis</Text>
          <Text style={pdfStyles.receiptTitle}>Official Sponsorship Receipt</Text>
          <Text style={pdfStyles.subtitle}>Faith, Formation, and Community Leadership</Text>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>Transaction Summary</Text>

          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Sponsorship Plan</Text>
            <Text style={pdfStyles.value}>{tier}</Text>
          </View>

          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Amount Paid</Text>
            <Text style={pdfStyles.value}>{currencySymbol}{amount} {currency}</Text>
          </View>

          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Payment Date</Text>
            <Text style={pdfStyles.value}>{date}</Text>
          </View>

          <View style={pdfStyles.row}>
            <Text style={pdfStyles.label}>Transaction ID</Text>
            <Text style={pdfStyles.txIdValue}>{txId}</Text>
          </View>

          {receiptUrl ? (
            <View style={pdfStyles.lastRow}>
              <Text style={pdfStyles.label}>Official Stripe Receipt URL</Text>
              <Text style={pdfStyles.linkValue}>{receiptUrl}</Text>
            </View>
          ) : null}
        </View>

        <View style={pdfStyles.footer}>
          <Text style={pdfStyles.footerText}>
            Thank you for your generous contribution. This document serves as official proof of payment.
          </Text>
          <Text style={pdfStyles.footerText}>
            Federación para la Catequesis Hispana (FCH) • www.fchcatechesis.org
          </Text>
        </View>
      </Page>
    </Document>
  )
}

function ReceiptContent() {
  const searchParams = useSearchParams()
  const tier = searchParams.get("tier") || "Sponsorship Plan"
  const amount = searchParams.get("amount") || "0.00"
  const currency = searchParams.get("currency") || "USD"
  const sessionId = searchParams.get("session_id")

  const [fetchedReceiptUrl, setFetchedReceiptUrl] = useState<string | null>(null)
  const [fetchedTxId, setFetchedTxId] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId) {
      api
        .get(`/payment/session-receipt?sessionId=${encodeURIComponent(sessionId)}`)
        .then((res) => {
          if (res.data?.receiptUrl) {
            setFetchedReceiptUrl(res.data.receiptUrl)
          }
          if (res.data?.transactionId) {
            setFetchedTxId(res.data.transactionId)
          }
        })
        .catch(() => {})
    }
  }, [sessionId])

  const rawTxId =
    sessionId ||
    searchParams.get("txId") ||
    searchParams.get("transaction_id") ||
    searchParams.get("payment_intent") ||
    "TXN-SPONSOR-" + Math.random().toString(36).substring(2, 8).toUpperCase()

  const txId = fetchedTxId || rawTxId
  const receiptUrl = searchParams.get("receipt_url") || searchParams.get("receipt") || fetchedReceiptUrl

  const [copied, setCopied] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleCopyTxId = () => {
    navigator.clipboard.writeText(txId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border-gray-200 bg-white pt-0 shadow-xl">
      <CardHeader className="bg-rose-50/50 p-8 pb-6 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Payment Successful!
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Thank you for your generous sponsorship. Your support makes a big
          difference.
        </p>
      </CardHeader>

      <CardContent className="p-8">
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
          <h3 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Transaction Proof &amp; Receipt
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-gray-200 pb-4">
              <span className="text-gray-500">Sponsorship Plan</span>
              <span className="font-semibold text-gray-900">{tier}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-4">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-semibold text-gray-900">
                {currency === "USD" ? "$" : "€"}
                {amount}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-4">
              <span className="text-gray-500">Payment Date</span>
              <span className="font-semibold text-gray-900">{date}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <span className="text-gray-500">Transaction ID</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-gray-900 bg-white border border-gray-200 px-2 py-1 rounded">
                  {txId}
                </span>
                <button
                  onClick={handleCopyTxId}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  title="Copy Transaction ID"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {receiptUrl && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-gray-500">Stripe Official Receipt</span>
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 hover:underline"
                >
                  View Official Receipt <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 p-8">
        {receiptUrl && (
          <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button
              variant="outline"
              className="h-12 w-full border-gray-200 text-gray-700 hover:cursor-pointer hover:bg-gray-50"
            >
              <FileText className="mr-2 h-4 w-4 text-rose-800" /> View Official Stripe Receipt
            </Button>
          </a>
        )}

        {isClient ? (
          <PDFDownloadLink
            document={
              <SponsorshipReceiptPDF
                tier={tier}
                amount={amount}
                currency={currency}
                txId={txId}
                date={date}
                receiptUrl={receiptUrl}
              />
            }
            fileName={`Sponsorship-Receipt-${txId}.pdf`}
            className="w-full"
          >
            {({ loading }) => (
              <Button
                variant="outline"
                disabled={loading}
                className="h-12 w-full border-gray-200 text-gray-700 hover:cursor-pointer hover:bg-gray-50"
              >
                <Download className="mr-2 h-4 w-4 text-rose-800" />
                {loading ? "Generating PDF Receipt..." : "Download Official PDF Receipt"}
              </Button>
            )}
          </PDFDownloadLink>
        ) : (
          <Button
            variant="outline"
            disabled
            className="h-12 w-full border-gray-200 text-gray-700"
          >
            <Download className="mr-2 h-4 w-4 text-rose-800" />
            Preparing PDF Receipt...
          </Button>
        )}

        <Link href="/" className="w-full">
          <Button className="h-12 w-full bg-rose-800 font-semibold hover:cursor-pointer hover:bg-rose-900">
            Return to Home <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] py-16">
      <Container>
        <Suspense
          fallback={
            <div className="py-20 text-center text-gray-500">
              Loading your receipt...
            </div>
          }
        >
          <ReceiptContent />
        </Suspense>
      </Container>
    </div>
  )
}
