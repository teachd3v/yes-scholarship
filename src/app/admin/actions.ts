'use server'

import { writeClient } from "@/sanity/client";
import { revalidatePath } from "next/cache";
import type { ApplicationListItem, ApplicationDetail, PaginatedResult } from "@/lib/types";

if (!writeClient) throw new Error("Sanity writeClient not configured")
const client = writeClient;

export async function updateApplicationStatus(id: string, status: 'approved' | 'rejected' | 'pending') {
  try {
    await client.patch(id).set({ status }).commit();
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, error: "Gagal mengupdate status" };
  }
}

export async function deleteApplication(id: string) {
  try {
    await client.delete(id);
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error("Error deleting application:", error);
    return { success: false, error: "Gagal menghapus data" };
  }
}

const PAGE_SIZE = 20;

export async function getApplications(page: number = 1): Promise<PaginatedResult<ApplicationListItem>> {
    try {
        const start = (page - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;

        const query = `{
            "items": *[_type == "application"] | order(_createdAt desc) [$start...$end] {
                _id,
                _createdAt,
                status,
                "nama": biodata.nama,
                "email": biodata.email,
                "whatsapp": biodata.whatsapp,
                "provinsi_nama": biodata.provinsi_nama,
                "penghasilan_ortu": keluarga.penghasilan_ortu,
                "nilai_raport_1": seleksi.nilai_raport_1,
                "nilai_raport_2": seleksi.nilai_raport_2,
                "nilai_raport_3": seleksi.nilai_raport_3,
                "total_skor": scoring.total_skor,
                "lolos_screening": scoring.lolos_screening,
                "detail_skor": scoring.detail_skor
            },
            "total": count(*[_type == "application"])
        }`;
        const data = await client.fetch(query, { start, end }, { cache: 'no-store' });
        return {
            items: data.items || [],
            total: data.total || 0,
            page,
            pageSize: PAGE_SIZE,
            totalPages: Math.ceil((data.total || 0) / PAGE_SIZE),
        };
    } catch (error) {
        console.error("Error fetching applications:", error);
        return { items: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 0 };
    }
}

export async function getApplicationById(id: string): Promise<ApplicationDetail | null> {
    try {
        const query = `*[_type == "application" && _id == $id][0] {
            ...,
            biodata {
                ...,
                "foto_diri_url": foto_diri.asset->url
            },
            keluarga {
                ...,
                "file_kk_url": file_kk.asset->url,
                "file_sktm_url": file_sktm.asset->url,
                "file_skb_url": file_skb.asset->url
            },
            seleksi {
                ...,
                "foto_raport_1_url": foto_raport_1.asset->url,
                "foto_raport_2_url": foto_raport_2.asset->url,
                "foto_raport_3_url": foto_raport_3.asset->url
            }
        }`;
        const data = await client.fetch(query, { id }, { cache: 'no-store' });
        return data;
    } catch (error) {
        console.error("Error fetching application:", error);
        return null;
    }
}
