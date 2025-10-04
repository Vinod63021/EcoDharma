"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MapPin, Recycle, CheckCircle, AlertCircle, Info, Hash, Clock, FileText, Navigation } from 'lucide-react';
import type { WasteReport } from '@/lib/types';
import { useWasteCollection } from '@/context/WasteCollectionContext';
import { formatDistanceToNow, format } from 'date-fns';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_CENTER_LAT = 12.9716; // Bangalore Latitude
const DEFAULT_CENTER_LON = 77.5946; // Bangalore Longitude
const INITIAL_LOAD_ZOOM = 11;
const SELECTED_REPORT_ZOOM = 15;
const MAP_IMAGE_SIZE = "800x600";

const getMarkerIcon = (recyclability: string, isSelected: boolean): string => {
    if (isSelected) return 'bluepin';
    switch (recyclability.toLowerCase()) {
        case 'recyclable': return 'greenpin';
        case 'non-recyclable': return 'redpin';
        default: return 'yellowpin';
    }
}

export default function WasteCollectionPage() {
    const { reports } = useWasteCollection();
    const [selectedReport, setSelectedReport] = useState<WasteReport | null>(null);
    const [mapImageUrl, setMapImageUrl] = useState<string>(`https://staticmap.openstreetmap.de/staticmap.php?center=${DEFAULT_CENTER_LAT},${DEFAULT_CENTER_LON}&zoom=${INITIAL_LOAD_ZOOM}&size=${MAP_IMAGE_SIZE}&maptype=mapnik`);
    const { toast } = useToast();
    const [userLatitude, setUserLatitude] = useState<number | null>(null);
    const [userLongitude, setUserLongitude] = useState<number | null>(null);

    useEffect(() => {
        // Attempt to get user's current location for the "Get Directions" feature
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLatitude(position.coords.latitude);
                    setUserLongitude(position.coords.longitude);
                },
                () => {
                    // Fail silently, directions will just not have an origin.
                    console.warn("Could not get user location for directions.");
                }
            );
        }
    }, []);


    useEffect(() => {
        if (selectedReport) {
            const markersString = reports
                .map(r => `${r.latitude},${r.longitude},${getMarkerIcon(r.classification.recyclability, r.id === selectedReport.id)}`)
                .join('|');
            setMapImageUrl(`https://staticmap.openstreetmap.de/staticmap.php?center=${selectedReport.latitude},${selectedReport.longitude}&zoom=${SELECTED_REPORT_ZOOM}&size=${MAP_IMAGE_SIZE}&maptype=mapnik&markers=${markersString}`);

        } else if (reports.length > 0) {
            const markersString = reports
                .map(r => `${r.latitude},${r.longitude},${getMarkerIcon(r.classification.recyclability, false)}`)
                .join('|');

            const avgLat = reports.reduce((sum, r) => sum + r.latitude, 0) / reports.length;
            const avgLon = reports.reduce((sum, r) => sum + r.longitude, 0) / reports.length;

            setMapImageUrl(`https://staticmap.openstreetmap.de/staticmap.php?center=${avgLat},${avgLon}&zoom=${INITIAL_LOAD_ZOOM}&size=${MAP_IMAGE_SIZE}&maptype=mapnik&markers=${markersString}`);
        } else {
            setMapImageUrl(`https://staticmap.openstreetmap.de/staticmap.php?center=${DEFAULT_CENTER_LAT},${DEFAULT_CENTER_LON}&zoom=${INITIAL_LOAD_ZOOM}&size=${MAP_IMAGE_SIZE}&maptype=mapnik`);
        }
    }, [reports, selectedReport]);

    const getRecyclabilityIcon = (recyclability?: string) => {
        if (!recyclability) return <Info className="h-5 w-5 text-yellow-500" />;
        switch (recyclability.toLowerCase()) {
            case 'recyclable':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'non-recyclable':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Info className="h-5 w-5 text-yellow-500" />;
        }
    };

    const handleGetDirections = () => {
        if (!selectedReport) return;
        const destination = `${selectedReport.latitude},${selectedReport.longitude}`;
        let googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
        if (userLatitude && userLongitude) {
            googleMapsUrl += `&origin=${userLatitude},${userLongitude}`;
        }
        window.open(googleMapsUrl, '_blank');
        toast({ title: "Opening Directions", description: `Getting directions to ${selectedReport.itemName} report.` });
    };

    return (
        <div className="space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary flex items-center">
                        <Recycle className="mr-3 h-7 w-7" /> Waste Collection Map
                    </CardTitle>
                    <CardDescription>
                        Map and log of recyclable waste reported by users for collection.
                        {selectedReport && ` Currently focused on report ID: ${selectedReport.id.substring(0, 8)}...`}
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="flex flex-col lg:flex-row gap-6">
                <Card className="lg:w-2/3 shadow-lg flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg">Map View</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow relative overflow-hidden h-96 lg:h-[600px] rounded-lg p-0">
                        <Image
                            key={mapImageUrl} // Force re-render on URL change
                            src={mapImageUrl}
                            alt="Map of waste collection reports"
                            layout="fill"
                            objectFit="cover"
                            priority
                            data-ai-hint="map location"
                        />
                    </CardContent>
                </Card>

                <div className="lg:w-1/3 space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl text-primary">Report Log</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reports.length > 0 ? (
                                <div className="max-h-[500px] overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Item</TableHead>
                                                <TableHead>Qty</TableHead>
                                                <TableHead>Location</TableHead>
                                                <TableHead>Time</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {reports.map(report => (
                                                <TableRow key={report.id} onClick={() => setSelectedReport(report)} className={`cursor-pointer ${selectedReport?.id === report.id ? 'bg-primary/10' : ''}`}>
                                                    <TableCell>{getRecyclabilityIcon(report.classification.recyclability)}</TableCell>
                                                    <TableCell className="font-medium">{report.itemName}</TableCell>
                                                    <TableCell className="text-xs">{report.quantity} {report.unit}</TableCell>
                                                    <TableCell className="text-xs font-mono">{`${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`}</TableCell>
                                                    <TableCell className="text-xs">{formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-4">No waste reports logged yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {selectedReport && (
                <Card className="shadow-lg mt-6">
                    <CardHeader className="flex flex-row justify-between items-start">
                        <div>
                            <CardTitle>Details for Report ID: {selectedReport.id.substring(0, 8)}...</CardTitle>
                            <CardDescription>Item: <span className="font-semibold text-primary">{selectedReport.itemName}</span></CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>Close</Button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-3 lg:col-span-1">
                            <div className="flex items-center"><Hash className="h-4 w-4 mr-2 text-accent" /><strong>Quantity:</strong><span className="ml-2">{selectedReport.quantity} {selectedReport.unit}</span></div>
                            <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-accent" /><strong>Location (Lat, Lng):</strong><span className="ml-2">{selectedReport.latitude.toFixed(6)}, {selectedReport.longitude.toFixed(6)}</span></div>
                            <div className="flex items-center"><Clock className="h-4 w-4 mr-2 text-accent" /><strong>Reported:</strong><span className="ml-2">{format(new Date(selectedReport.timestamp), 'PPpp')}</span></div>
                            {selectedReport.notes && <div className="flex items-start"><FileText className="h-4 w-4 mr-2 mt-1 text-accent" /><strong>Notes:</strong><p className="ml-2 whitespace-pre-wrap">{selectedReport.notes}</p></div>}
                            <Button size="sm" className="w-full mt-2" onClick={handleGetDirections}><Navigation className="mr-2 h-4 w-4" /> Get Directions</Button>
                        </div>
                        <div className="space-y-2 rounded-lg bg-muted/50 p-3 lg:col-span-2">
                            <h4 className="font-semibold text-primary flex items-center"><Info className="h-4 w-4 mr-2" />AI Analysis</h4>
                            <p><strong>Recyclability:</strong> <span className="font-medium">{selectedReport.classification.recyclability}</span></p>
                            {selectedReport.classification.recycleChannels.length > 0 && <div><strong>Recycle Channels:</strong> <ul className="list-disc pl-5"> {selectedReport.classification.recycleChannels.map((c, i) => <li key={i}>{c}</li>)}</ul></div>}
                            {selectedReport.classification.reuseSuggestions.length > 0 && <div><strong>Reuse Ideas:</strong> <ul className="list-disc pl-5">{selectedReport.classification.reuseSuggestions.map((s, i) => <li key={i}>{s.suggestion}</li>)}</ul></div>}
                            {selectedReport.classification.donateSuggestions.length > 0 && <div><strong>Donation Ideas:</strong> <ul className="list-disc pl-5">{selectedReport.classification.donateSuggestions.map((d, i) => <li key={i}>{d}</li>)}</ul></div>}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
