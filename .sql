----cek perhitungan pemkaian KWH pelanggan tunggal dan non abumenen
select * from(
SELECT
    a.unitup,
    a.idpel,
    a.thblrek,
    a.tarif,
    a.daya,
    a.tarif_lm_pindah_trf AS tarif_lm,
    a.daya_lm_pindah_trf AS daya_lm,
    a.kdpt,
    a.kdpt_2,
    a.kdam,
    a.jnsmut,
    a.thblmut,
    a.postingbilling,
    a.tglbacalalu,
    a.tglbacaakhir,
    a.tglrubah,
    a.fakm,
    (select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='PECAHAN') as  FAKM_LM,
    a.frt,
    CASE 
        WHEN a.tarif IN ('S2','S2K','LS2','LS2K','I3','I3P','LI3','I4','LI4','B3','LB3')
             OR CAST(a.daya AS NUMERIC) > 200000
        THEN 'G'
        ELSE 'T'
    END AS tg,
    a.slalwbp,
    a.sahlwbp_cabut,
    a.slalwbp_pasang,
    a.sahlwbp,
    a.slawbp,
    a.sahwbp_cabut,
    a.slawbp_pasang,
    a.sahwbp,
    a.slakvarh,
    a.sahkvarh_cabut,
    a.slakvarh_pasang,
    a.sahkvarh,
    (
        SELECT b.pemkwh_real
        FROM otc.data_bill_energi b
        WHERE b.idpel = a.idpel
          AND b.thblrek = a.thblrek
        LIMIT 1
    ) AS kwhreal_system,
    case when thblrek=thblmut and jnsmut like'%J%' then
    	CASE WHEN sahlwbp_cabut <slalwbp and  sahlwbp>=a.slalwbp_pasang THEN
	    	(((POWER(10, LENGTH(round(slalwbp,0)::text)) - slalwbp + sahlwbp_cabut)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='PECAHAN'))
	    	+((sahlwbp-slalwbp_pasang)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL')))
    	WHEN sahlwbp_cabut <slalwbp and  sahlwbp<a.slalwbp_pasang THEN 
	    	(
	    	((POWER(10, LENGTH(round(slalwbp,0)::text)) - slalwbp + sahlwbp_cabut)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='PECAHAN'))+
	    	((POWER(10, LENGTH(round(slalwbp_pasang,0)::text)) - slalwbp_pasang + sahlwbp)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL')))
    	WHEN sahlwbp_cabut>=slalwbp and  sahlwbp<a.slalwbp_pasang THEN 
	    	(((sahlwbp_cabut-slalwbp)*(select fakm_lm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='PECAHAN'))+
	    	((POWER(10, LENGTH(round(slalwbp_pasang,0)::text)) - slalwbp_pasang + sahlwbp)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL')))
	    else
	    	(
	    	((sahlwbp_cabut-slalwbp)*(select fakm_lm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='PECAHAN'))
	    	+((sahlwbp-slalwbp_pasang)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL'))
	    	)
	    END 
    else
	    CASE WHEN sahlwbp <slalwbp THEN 
	    	((POWER(10, LENGTH(round(slalwbp,0)::text)) - slalwbp + sahlwbp)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL'))
	    ELSE 
	    	((sahlwbp-slalwbp)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL'))
	    END 
	end AS kwhlwbp_manual
    FROM otc.data_bill a
WHERE a.thblrek = '202604' and thblrek!=thblmut
and tarif not in('C','P3','I2','I3','I3P','LI2','LI3','B3','LB3','S2','S2K','LS2','LS2K','P2','LP2','I4','LI4')
)
where ROUND(kwhreal_system::numeric, 0)!=ROUND(kwhlwbp_manual::numeric, 0)

----cek perhitungan pemkaian KWH pelanggan tunggal dan non abumene mutasi
select * from(
SELECT
    a.unitup,
    a.idpel,
    a.thblrek,
    a.tarif,
    a.daya,
    a.tarif_lm_pindah_trf AS tarif_lm,
    a.daya_lm_pindah_trf AS daya_lm,
    a.kdpt,
    a.kdpt_2,
    a.kdpt_lama_pindah_trf AS kdpt_lm,
    a.kdam,
    a.jnsmut,
    a.thblmut,
    a.postingbilling,
    a.tglbacalalu,
    a.tglbacaakhir,
    a.tglrubah,
    a.fakm,
    (select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='PECAHAN') as  FAKM_LM,
    a.frt,
    CASE 
        WHEN a.tarif IN ('S2','S2K','LS2','LS2K','I3','I3P','LI3','I4','LI4','B3','LB3','C')
             OR CAST(a.daya AS NUMERIC) > 200000
        THEN 'G'
        ELSE 'T'
    END AS tg,
    a.slalwbp,
    a.sahlwbp_cabut,
    a.slalwbp_pasang,
    a.sahlwbp,
    a.slawbp,
    a.sahwbp_cabut,
    a.slawbp_pasang,
    a.sahwbp,
    a.slakvarh,
    a.sahkvarh_cabut,
    a.slakvarh_pasang,
    a.sahkvarh,
    (
        SELECT sum(b.pemkwh_real)
        FROM otc.data_bill_energi b
        WHERE b.idpel = a.idpel
          AND b.thblrek = a.thblrek
    ) AS kwhreal_system,
    (
        SELECT b.pemkwh_reg
        FROM otc.data_bill_energi b
        WHERE b.idpel = a.idpel
          AND b.thblrek = a.thblrek
    ) AS pemkwh_br_system,
    case when thblrek=thblmut and jnsmut like'%J%' then
    	CASE WHEN sahlwbp_cabut <slalwbp and  sahlwbp>=a.slalwbp_pasang THEN
	    	(((POWER(10, LENGTH(round(slalwbp,0)::text)) - slalwbp + sahlwbp_cabut)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='PECAHAN'))
	    	+((sahlwbp-slalwbp_pasang)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL')))
    	WHEN sahlwbp_cabut <slalwbp and  sahlwbp<a.slalwbp_pasang THEN 
	    	(
	    	((POWER(10, LENGTH(round(slalwbp,0)::text)) - slalwbp + sahlwbp_cabut)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='PECAHAN'))+
	    	((POWER(10, LENGTH(round(slalwbp_pasang,0)::text)) - slalwbp_pasang + sahlwbp)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL')))
    	WHEN sahlwbp_cabut>=slalwbp and  sahlwbp<a.slalwbp_pasang THEN 
	    	(((sahlwbp_cabut-slalwbp)*(select fakm_lm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='PECAHAN'))+
	    	((POWER(10, LENGTH(round(slalwbp_pasang,0)::text)) - slalwbp_pasang + sahlwbp)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL')))
	    else
	    	(
	    	((sahlwbp_cabut-slalwbp)*(select fakm_lm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='PECAHAN'))
	    	+((sahlwbp-slalwbp_pasang)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL'))
	    	)
	    END 
    else
	    CASE WHEN sahlwbp <slalwbp THEN 
	    	case when a.tarif IN ('S2','S2K','LS2','LS2K','I3','I3P','LI3','I4','LI4','B3','LB3','C','I2','LI2') then	    	
		    	((((POWER(10, LENGTH(round(slalwbp,0)::text)) + sahlwbp)-slalwbp))*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL'))+
		    	((((POWER(10, LENGTH(round(slawbp,0)::text)) + sahwbp)-slawbp))*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL'))
		    else
		    	((((POWER(10, LENGTH(round(slalwbp,0)::text)) + sahlwbp)-slalwbp))*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL'))
			end
	    else
	    	case when a.tarif IN ('S2','S2K','LS2','LS2K','I3','I3P','LI3','I4','LI4','B3','LB3','C','I2','LI2') then
	    		((sahlwbp-slalwbp)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL'))+
	    		((sahwbp-slawbp)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL'))
	    	else
	    		((sahlwbp-slalwbp)*(select fakm from otc.data_bill_energi b where b.thblrek=a.thblrek and b.idpel=a.idpel and b.jenis_energi='NORMAL'))
	    	end
	    END 
	end AS kwhlwbp_manual
    FROM otc.data_bill a
WHERE a.thblrek = '202604' and thblrek=thblmut and jnsmut like'%J%'
and tarif not  in('P3','I2','I3','LI2','LI3','B3','LB3','S2','S2K','LS2','LS2K','P2','LP2','I4','LI4')
) a
where (ROUND(kwhreal_system::numeric, 0)!=ROUND(kwhlwbp_manual::numeric, 0))
and not exists(select 'X' from otc.master_plg_plts_atap b where b.idpel=a.idpel)


------cek perhitungan kwh abonemen 720 JN
select thblrek,tarif,daya,kdpt_2,pemkwh,jamnyala,((daya/1000)*720) KWH_NAMNUAL
FROM otc.data_bill a
WHERE a.thblrek = '202604'
and tarif='P3' and kdpt_2='2'
and pemkwh!=((daya/1000)*720)
and thblmut!=thblrek

------cek perhitungan kwh abonemen 375 JN
select thblrek,tarif,daya,kdpt_2,pemkwh,jamnyala,round(((daya/1000)*375)::numeric, 0) KWH_NAMNUAL
FROM otc.data_bill a
WHERE a.thblrek = '202604'
and tarif='P3' and kdpt_2='3'
and pemkwh!=round(((daya/1000)*375)::numeric, 0)
and thblmut!=thblrek


-------------------------CEK PELANGGAN BEBAN BEBAN-------------------
SELECT * FROM (
SELECT
XX.*,
CASE WHEN TARIF IN('T') 
    THEN 
        CASE WHEN (XX.DAYAMAKS)>(0.5*XX.DAYA) THEN 'PENGAL
I BEBAN DARI DAYAMAX'
             WHEN (XX.DAYAMAKS)<=(0.5*XX.DAYA) THEN 'PENGALI BEBAN DARI DAYA KONTRAK'
        END
    ELSE
        'BEBAN SELAIN TRAKSI'
END KET_BEBAN,
CASE WHEN TARIF IN('T') 
    THEN 
        CASE WHEN (XX.DAYAMAKS)>(0.5*XX.DAYA) THEN (XX.BIAYA_BEBAN*(XX.DAYAMAKS/1000))
             WHEN (XX.DAYAMAKS)<=(0.5*XX.DAYA) THEN (XX.BIAYA_BEBAN*((0.5*XX.DAYA/1000)))
        END
    ELSE
    ((XX.DAYA/1000)*XX.BIAYA_BEBAN*FAKTOR_FJN) 
END RPBEBAN_MANUAL
FROM (
SELECT
THBLREK,UNITUPI, UNITAP, UNITUP, IDPEL, TARIF, DAYA, kdpt,kdpt_2, DAYAMAKS, FJN,FAKMKVAM, 
CASE WHEN A.FJN IN('L','M','S') THEN (SELECT KONSTANTA FROM bill52.REF_FJN WHERE FJN=A.FJN) ELSE 1 END FAKTOR_FJN,
(SELECT BBEBAN FROM otc.BILLAP2T_TARIF_TDL2010 WHERE TARIF=A.TARIF AND A.DAYA BETWEEN DAYA_MIN AND DAYA_MAX AND A.THBLREK BETWEEN THBL_AWAL AND THBL_AKHIR) BIAYA_BEBAN,
RPBEBAN RPBEBAN_BILLING
FROM otc.data_bill A WHERE THBLREK='202603' AND ((TARIF IN('R1','B1','S1','I1') AND DAYA<=900) or tarif='T') AND THBLREK<>THBLMUT
AND (KDPT NOT IN('SP') OR TRIM(KDPT) IS NULL) --PELANGGAN SPEL
) XX 
) 
where RPBEBAN_BILLING!=ROUND(RPBEBAN_MANUAL::numeric, 0) or KET_BEBAN='PENGALI BEBAN DARI DAYAMAX'

---------------cek sadlo reduksi---------
select * from otc.trans_lebihbayar_pasca where thblrek='202604' and idpel in(
select idpel from otc.trans_lebihbayar_pasca where thblrek='202603' and rpsaldo_akhir='0'
and idpel in(select idpel from otc.trans_lebihbayar_pasca where thblrek='202604'))
and rpoffset>0
order by idpel,keterangan


select a1.*,(rpsaldo_akhir_202603-rpsaldo_awal_202604) SELISIH
from (
select a.idpel,
case when (select idpel from otc.trans_lebihbayar_PASCA C  where C.thblrek='202603' and C.idpel=a.idpel and C.keterangan='DKRP' AND C.POSTINGBILLING='3') is not null then
    (select rpsaldo_akhir from otc.trans_lebihbayar_PASCA C  where C.thblrek='202603' and C.idpel=a.idpel and C.keterangan='DKRP' AND C.POSTINGBILLING='3')
else    
    a.rpsaldo_akhir 
end rpsaldo_akhir_202603,
(select rpsaldo_awal from otc.trans_lebihbayar_PASCA b  where b.thblrek='202604' and b.idpel=a.idpel and KETERANGAN='BILLING') rpsaldo_awal_202604
from otc.trans_lebihbayar_PASCA a where thblrek='202603' AND KETERANGAN='BILLING' and rpsaldo_akhir>0
) a1
where  RPSALDO_AKHIR_202603!=RPSALDO_AWAL_202604


select * from otc.trans_lebihbayar_stimulus where thblrek='202604' and idpel in(
select idpel from otc.trans_lebihbayar_stimulus where thblrek='202603' and rpsaldo_akhir='0'
and idpel in(select idpel from otc.trans_lebihbayar_stimulus where thblrek='202604'))
and rpoffset>0
order by idpel,keterangan

select a1.*,(rpsaldo_akhir_202603-rpsaldo_awal_202604) SELISIH
from (
select a.idpel,
case when (select idpel from otc.trans_lebihbayar_stimulus C  where C.thblrek='202603' and C.idpel=a.idpel and C.keterangan='DKRP' AND C.POSTINGBILLING='3') is not null then
    (select rpsaldo_akhir from otc.trans_lebihbayar_stimulus C  where C.thblrek='202603' and C.idpel=a.idpel and C.keterangan='DKRP' AND C.POSTINGBILLING='3')
else    
    a.rpsaldo_akhir 
end rpsaldo_akhir_202603,
(select rpsaldo_awal from otc.trans_lebihbayar_stimulus b  where b.thblrek='202604' and b.idpel=a.idpel and KETERANGAN='BILLING') rpsaldo_awal_202604
from otc.trans_lebihbayar_stimulus a where thblrek='202603' AND KETERANGAN='BILLING' and rpsaldo_akhir>0
) a1
where  RPSALDO_AKHIR_202603!=RPSALDO_AWAL_202604

select /*+index(IDX_otc.data_bill)*/  unitup,idpel,thblrek,tarif,daya,
a.tarif_lm_pindah_trf as tarif_lm,a.daya_lm_pindah_trf as daya_lm,
kdpt,kdpt_2,kdam,jnsmut,thblmut,POSTINGBILLING,tglbacalalu,
tglbacaakhir,tglrubah,fakm,slalwbp,sahlwbp_cabut,slalwbp_pasang,sahlwbp,
slawbp,sahwbp_cabut,slawbp_pasang,sahwbp,slakvarh,sahkvarh_cabut,slakvarh_pasang,sahkvarh,pemkwh,pemkvarh,kelbkvarh,
pecahan,jamnyala,(rplwbp+rpwbp+rpblok3+rpbeban) ptl_mnl,rpptl,rptag,rpreduksi,kdproses,rpdiskon,rpselisih,
(select FLAG_BEBAS_RM from otc.master_plg_kblbb f where f.idpel=a.idpel) FLAG_BEBAS_RM
from otc.data_bill a where  thblrek='202604' and rptag=0 
and COALESCE(RPREDUKSI,0)='0' and COALESCE(RPDISKON,0)='0' and tarif not in('C') and postingbilling>'1'

-------------------cek angsuran bulan berjalan belum tergenerate---
select thblrek,idpel,tarif,daya,rpangsa,rpangsb,rpangsc
from otc.data_bill where thblrek='202604' and postingbilling>'1'
and (rpangsa+rpangsb+rpangsc)=0
and idpel in(select idpel from bill52.trans_sph_detil a where thblrek='202604'
and tglbatal is null and tgllunas106 is null)

select * from bill52.trans_sph_detil where idpel='181600766988'
order by thblrek,idpel,kdangs


select * from bill52.trans_sph_detil a where thblrek='202604'
and tglbatal is null and tgllunas106 is null
and idpel in(select idpel from otc.data_bill where thblrek='202604' 
and (rpangsa+rpangsb+rpangsc)=0)

-------------cek materai lamaa-------------
select thblrek,idpel,tarif,daya,rpmat 
from otc.data_bill where thblrek='202604' and rpmat in('3000','6000')

---======cek meterai diats 5juta harus 10000==================
select thblrek,idpel,tarif,daya,rpmat 
from otc.data_bill where thblrek='202604' and (rpptl+rpangsa+rpangsb+rpangsc)>5000000 and rpmat<>'10000'

---======cek meterai diats 5juta harus 10000==================
select thblrek,idpel,tarif,daya,rpmat,rptag
from otc.data_bill where thblrek='202604' and rptag>5000000 and rpmat<>'10000'

---======cek meterai dibawah 5juta harus nol==================
select thblrek,idpel,tarif,daya,rpmat,rptag 
from otc.data_bill where thblrek='202604' and rptag<='5000000' and rpmat>0


---=====================pengecekan dibawah RM 40jn=====================
select unitupi,idpel,tarif,daya,kwhlwbp,kwhwbp,blok3,kelbkvarh,pemkwh,rplwbp,rpwbp,rpblok3,rpkvarh,rpbeban,rpptl,
(select RPREKMIN from  otc.data_bill_energi c where c.thblrek=a.thblrek and c.idpel=a.idpel) RPREKMIN,jamnyala
from otc.data_bill a where thblrek='202604' and
daya>='1300' and jamnyala<40 and thblmut<>thblrek and rpkvarh=0 and jamnyala<35 and tarif<>'T' and RPBEBAN=0
AND NOT EXISTS(SELECT IDPEL FROM otc.BILL_PLTS_ATAP B WHERE B.THBLREK='202604' AND B.IDPEL=A.IDPEL)
and not exists (select * from otc.MASTER_PLG_KBLBB c where c.idpel=a.idpel)


select a1.*,
round(((11/12)*RPPTL)::numeric, 0) DPP_LAIN_PTL_MNL,
(select DPP_PTL from otc.bill_dpp_ppn b where b.thblrek=a1.thblrek and b.idpel=a1.idpel) DPP_LAIN_PTL
from (
select thblrek,idpel,tarif,daya,rpptl,rpbptrafo,rpsewatrafo,rpsewakap,rpppn rpppn_total,RPPPN_R3,
case when RPPPN_R3>0 then (rpptl*0.11) else 0 end rpppn_r3_asli,
case when RPPPN_R3>0 then ceil(rpptl*0.11) else 0 end rpppn_r3_manual,
RPPPN_BPTRAFO,
case when RPPPN_BPTRAFO>0 then (rpbptrafo*0.11) else 0 end rpppn_bptrafo_asli,
case when RPPPN_BPTRAFO>0 then floor(rpbptrafo*0.11) else 0 end rpppn_bptrafo_manual,
RPPPN_SEWATRAFO,
case when RPPPN_SEWATRAFO>0 then (rpsewatrafo*0.11) else 0 end rpppn_sewatrf_asli,
case when RPPPN_SEWATRAFO>0 then trunc(rpsewatrafo*0.11) else 0 end rpppn_sewatrf_manual,
RPPPN_SEWAKAP,
case when RPPPN_SEWAKAP>0 then (rpsewakap*0.11) else 0 end rpppn_sewakap_asli,
case when RPPPN_SEWAKAP>0 then floor(rpsewakap*0.11) else 0 end rpppn_sewakap_manual
from otc.data_bill where thblrek='202604'  and rpppn>0
and rpppn_r3>0 and RPPPN_BPTRAFO=0 and RPPPN_SEWATRAFO=0 and RPPPN_SEWAKAP=0) a1
where RPPPN_R3<>round(RPPPN_R3_MANUAL::numeric, 0)
and ((RPPPN_R3-RPPPN_R3_MANUAL)>1 or (RPPPN_R3_MANUAL-RPPPN_R3)<-1)

select a1.*,
round(((11/12)*rpsewakap_dil),0) DPP_LAIN_BPTRF_DIL_MNL,
(select DPP_SEWAKAP from otc.bill_dpp_ppn b where b.thblrek=a1.thblrek and b.idpel=a1.idpel) DPP_LAIN_BPTRF_DIL
from (
select thblrek,idpel,tarif,daya,rpbptrafo,rpsewatrafo,rpsewakap,rpppn rpppn_total,RPPPN_R3,
(select rpsewakap from bill52.dil_sewakap b where b.idpel=a.idpel) rpsewakap_dil,
case when RPPPN_R3>0 then (rpptl*0.11) else 0 end rpppn_r3_asli,
case when RPPPN_R3>0 then trunc(rpptl*0.11) else 0 end rpppn_r3_manual,
RPPPN_BPTRAFO,
case when RPPPN_BPTRAFO>0 then (rpbptrafo*0.11) else 0 end rpppn_bptrafo_asli,
case when RPPPN_BPTRAFO>0 then floor(rpbptrafo*0.11) else 0 end rpppn_bptrafo_manual ,
RPPPN_SEWATRAFO,
case when RPPPN_SEWATRAFO>0 then (rpsewatrafo*0.11) else 0 end rpppn_sewatrf_asli,
case when RPPPN_SEWATRAFO>0 then trunc(rpsewatrafo*0.11) else 0 end rpppn_sewatrf_manual,
RPPPN_SEWAKAP,
case when RPPPN_SEWAKAP>0 then (rpsewakap*0.11) else 0 end rpppn_sewakap_asli,
case when RPPPN_SEWAKAP>0 then floor(rpsewakap*0.11) else 0 end rpppn_sewakap_manual
from otc.data_bill  a where thblrek='202604'  and rpppn>0 and
(rpppn_r3=0 and RPPPN_BPTRAFO=0  and RPPPN_SEWATRAFO=0 and RPPPN_SEWAKAP>0))a1
where RPPPN_SEWAKAP<>RPPPN_SEWAKAP_MANUAL

----cek pelanggan PPN >0 tapi belum tergenerate dpp lain---
select * from otc.data_bill a where thblrek='202604'  and rpppn>0
and not exists(select 'X' from otc.bill_dpp_ppn b where b.thblrek=a.thblrek and b.idpel=a.idpel)  

-----cek pelanggan BTS TBG TELKOMSEL KDPT C dan interneux kdpt e-----------
select * from otc.data_bill where thblrek='202604' and trim(kdpt) in('C','E','LP')

----penambahan pelanggan tarif C TR-------------
select * from otc.data_bill where thblrek='202604' and tarif='C' and daya<'200000'
and kelbkvarh>0 AND TGL_KARGO IS NULL order by rpkvarh desc


----CEK ENTRIAN HARGA TERTINGGI PKS PREMIUM PER IDPEL ---------------
select * from otc.master_plg_pks a where '202604' between thbl_awal and thbl_akhir and TRFLWBP>2000 
and exists(select * from bill52.dil_main b where b.idpel=a.idpel and b.kdpt='A')
order by TRFLWBP desc

----CEK ENTRIAN HARGA TERENDAH PKS PREMIUM PER IDPEL ---------------
select * from otc.master_plg_pks a where '202604' between thbl_awal and thbl_akhir 
and exists(select * from bill52.dil_main b where b.idpel=a.idpel and b.kdpt='A')
order by TRFLWBP asc

select * from otc.master_plg_uap a where idpel='182103579226' and 
'202604' between thbl_awal and thbl_akhir 


---cek layanan prioritas----
select * from(
select a1.*,round((trflwbp/1644.52),2) FAKTOR_N from (
select a.*,
(select nama from bill52.dil_main bb where bb.idpel=a.idpel) NAMA,
(select trflwbp from otc.master_plg_pks b where b.idpel=a.idpel and a.thblrek between thbl_awal and thbl_akhir) TRFLWBP,
(select emin from otc.master_plg_pks b where b.idpel=a.idpel and a.thblrek between thbl_awal and thbl_akhir) EMIN_PKS,
(select RM from otc.master_plg_pks b where b.idpel=a.idpel and a.thblrek between thbl_awal and thbl_akhir) RM_PKS
 from 
(select thblrek,unitupi,unitap,unitup,idpel,tarif,daya,kdpt,kdpt_2,pemkwh,jamnyala,postingbilling,thblmut,jnsmut from otc.data_bill where thblrek='202604' and kdpt='A') a)a1
 where trflwbp>='1644.52') ---where emin_pks>40
 where daya>200000 and  FAKTOR_N not in('1.05') and
 FAKTOR_N not in('1.1','1.05') or EMIN_PKS<>'40'
 
 ---cek layanan prioritas----
select a1.*,round((trflwbp/1644.52),2) FAKTOR_N from (
select a.*,
(select trflwbp from otc.master_plg_pks b where b.idpel=a.idpel and '202604' between thbl_awal and thbl_akhir) TRFLWBP
 from 
(select thblrek,unitupi,unitap,unitup,idpel,tarif,daya,kdpt,kdpt_2,
(select nama from bill52.dil_main b where b.idpel=a.idpel)nama,postingbilling 
from otc.data_bill a where thblrek='202604' and kdpt='A') a)a1
where trflwbp<'1644.52'

----cek anomlai tglbaca------
select /*+index(IDX_otc_data_bill)*/  unitup,idpel,thblrek,tarif,daya,
a.tarif_lm_pindah_trf ,
a.daya_lm_pindah_trf,
kdpt,kdpt_2,kdam,jnsmut,thblmut,POSTINGBILLING,tglbacalalu,
tglbacaakhir,tglrubah,fakm,slalwbp,sahlwbp_cabut,slalwbp_pasang,sahlwbp,
slawbp,sahwbp_cabut,slawbp_pasang,sahwbp,
slakvarh,sahkvarh_cabut,slakvarh_pasang,sahkvarh,pemkwh,pemkvarh,kelbkvarh,
pecahan,jamnyala,rptag,kdproses,tglsah,
(to_date(tglbacaakhir,'YYYYMMDD')-to_date(tglbacalalu,'YYYYMMDD')) DURASI_BACA
from otc.data_bill a where thblrek='202604' and  ---tglbacalalu='20180315'  and
((to_date(tglbacaakhir,'YYYYMMDD')-to_date(tglbacalalu,'YYYYMMDD'))>35)
order by DURASI_BACA desc

select * from otc.data_bill where thblrek='202604' and thblmut='202604'
and substr(tglbacaakhir,1,6)<'202512'  and thblmut<>thblrek

select * from otc.BILL_TARIF_NON_SUBSIDI
where '202604' between thbl_awal and thbl_akhir

select  unitup,idpel,thblrek,tarif,daya,
 a.tarif_lm_pindah_trf ,
a.daya_lm_pindah_trf ,
kdpt,kdpt_2,kdam,jnsmut,thblmut,POSTINGBILLING,tglbacalalu,
tglbacaakhir,tglrubah,fakm,slalwbp,sahlwbp_cabut,slalwbp_pasang,sahlwbp,
slawbp,sahwbp_cabut,slawbp_pasang,sahwbp,
slakvarh,sahkvarh_cabut,slakvarh_pasang,sahkvarh,pemkwh,pemkvarh,kelbkvarh,
pecahan,jamnyala,rptag,kdproses,tgl_kargo
from otc.data_bill a
where thblrek='202604' and thblrek=thblmut and jnsmut like'%D%'
and tarif_lm_pindah_trf like'%T'
and postingbilling>'1' and sahlwbp<slalwbp


select * from (
   SELECT a2.*,
          ROUND (a2.KWH_TARIFDAYA_BARU, 2) "KWH_TARIFDAYA_BARU",
          ROUND (a2.KWH_TARIFDAYA_LAMA, 2) "KWH_TARIFDAYA_LAMA",
          CASE
             WHEN status = 'MUTASI PERUBAHAN TARIF DAYA'
             THEN
                ROUND ( (KWH_TARIFDAYA_LAMA / (daya_lm / 1000)), 0)
             ELSE
                0
          END
             JAMNYALA_LM,
          CASE
             WHEN status = 'MUTASI PERUBAHAN TARIF DAYA'
             THEN
                ROUND ( (KWH_TARIFDAYA_BARU / (daya / 1000)), 0)
             ELSE
                round(a2.JAMNYALA,2)
          END
             JAMNYALA_BR,
          now() as tglrekap
     FROM (    
     SELECT a1.*,
      CASE WHEN status = 'MUTASI PERUBAHAN TARIF DAYA'  THEN
           (SELECT   COALESCE (PEMKWH_REG, 0) + COALESCE (PEMKWH_PREMIUM, 0)
           FROM otc.data_bill_energi b
           WHERE  thblrek = '202604' and jenis_energi='NORMAL'
           AND b.idpel = a1.idpel)
     ELSE
          a1.pemkwh
     END as KWH_TARIFDAYA_BARU,
     CASE WHEN status = 'MUTASI PERUBAHAN TARIF DAYA'  THEN
         (SELECT   COALESCE (PEMKWH_REG, 0)  + COALESCE (PEMKWH_PREMIUM, 0)
         FROM otc.data_bill_energi b
         WHERE  thblrek = '202604' and jenis_energi='PECAHAN'
         AND b.idpel = a1.idpel)
     ELSE
         0
     END as KWH_TARIFDAYA_LAMA
             FROM (
             SELECT a.unitupi,
                          (SELECT satuan || ' ' || nama NAMA_DIST
                             FROM bill52.unitupi G
                            WHERE G.UNITUPI = a.UNITUPI)
                             NAMA_DIST,
                          a.unitap,
                          (SELECT NAMA
                             FROM BILL52.UNITAP d
                            WHERE d.UNITAP = a.UNITAP)
                             NAMA_UNITAP,
                          a.unitup,
                          (SELECT NAMA
                             FROM BILL52.UNITUP e
                            WHERE e.UNITUP = a.UNITUP)
                             NAMA_UNITUP,
                          idpel,
                          thblrek,
                          tarif,
                          daya,
                          kdpt,
                          kdpt_2,
                          tarif_lm_pindah_trf as TARIF_LM,
                          daya_lm_pindah_trf  as daya_LM,
                          kdpt_lama_pindah_trf  as kdpt_LM,
                          kdam,
                          jnsmut,
                          thblmut,
                          POSTINGBILLING,
                          tglbacalalu,
                          tglbacaakhir,
                          tglrubah,
                          fakm,
                          slalwbp,
                          sahlwbp_cabut,
                          slalwbp_pasang,
                          sahlwbp,
                          slawbp,
                          sahwbp_cabut,
                          slawbp_pasang,
                          sahwbp,
                          slakvarh,
                          sahkvarh_cabut,
                          slakvarh_pasang,
                          sahkvarh,
                          pemkwh,
                          pemkvarh,
                          kelbkvarh,
                          pecahan,
                          jamnyala,
                          rptag,
                          kdproses,
                          msg,
                          tglhitung,
                          CASE
                             WHEN     a.thblrek = a.thblmut
                                  AND (jnsmut LIKE '%D%' OR jnsmut LIKE '%E%')
                             THEN
                                'MUTASI PERUBAHAN TARIF DAYA'
                             WHEN     a.thblrek = a.thblmut
                                  AND (jnsmut = 'J' OR jnsmut LIKE 'J%')
                             THEN
                                'MUTASI GANTI METER'
                             else
                                'REGULER TANPA MUTASI'
                          end as STATUS
from  otc.data_bill a
WHERE thblrek = '202604' and thblrek=thblmut 
AND postingbilling >= '1'
)a1)a2) where jamnyala_lm>'720' or jamnyala_br>'720' 

select * from bill52.dil_main where idpel='181110105743'

select 2334-1794

select 540/(450/1000)
                          

select idpel,tarif,daya,thblmut,jnsmut,pemkwh,rplwbp , rpwbp ,rpblok3 , rpkvarh , rpbeban,rp_kompor,rpptl,rpdiskon,rpreduksi,rptag,tgl_kargo
  from otc.data_bill
 where  thblrek = '202604' AND POSTINGBILLING>'1'
 and  ((COALESCE(rplwbp,0) + COALESCE(rpwbp,0) + COALESCE(rpblok3,0) + COALESCE(rpkvarh,0) + COALESCE(rpbeban,0)+ COALESCE(rp_kompor,0))-COALESCE(rpdiskon,0)) <> rpptl
 

 select /*+index(IDX_emulsion.billap2t)*/  unitup,idpel,thblrek,tarif,daya,
kdpt,kdpt_2,kdam,jnsmut,thblmut,POSTINGBILLING,tglbacalalu,
tglbacaakhir,tglrubah,fakm,slalwbp,sahlwbp_cabut,slalwbp_pasang,sahlwbp,
slawbp,sahwbp_cabut,slawbp_pasang,sahwbp,slakvarh,sahkvarh_cabut,slakvarh_pasang,sahkvarh,pemkwh,pemkvarh,kelbkvarh,
pecahan,jamnyala,rpkvarh,rpptl,rptag,rpreduksi,kdproses
from otc.data_bill a where  thblrek='202604'and idpel='181110436658'

select * from (
select   unitupi,unitap,unitup,idpel,(select nama from bill52.dil_main b where b.idpel=a.idpel) NAMA,thblrek,tarif,daya,
kdpt,kdpt_2,kdam,jnsmut,thblmut,POSTINGBILLING,tglbacalalu,
tglbacaakhir,tglrubah,fakm,slalwbp,sahlwbp_cabut,slalwbp_pasang,sahlwbp,
slawbp,sahwbp_cabut,slawbp_pasang,sahwbp,slakvarh,sahkvarh_cabut,slakvarh_pasang,sahkvarh,pemkwh,pemkvarh,kelbkvarh,
pecahan,jamnyala,rptag,rpreduksi,kdproses,kdpembmeter
from otc.data_bill a where  thblrek='202604' and sahlwbp<slalwbp and kdpembmeter='A' and thblrek<>thblmut)
order by jamnyala desc

select idpel,tarif,daya,thblmut,jnsmut,pemkwh,kwhlwbp ,kwhwbp,blok3,kwh_kompor
  from otc.data_bill
 where  thblrek = '202604' and postingbilling>'1'
 and  pemkwh<>(COALESCE(kwhlwbp,0)+COALESCE(kwhwbp,0)+COALESCE(blok3,0))
 
  select idpel,tarif,daya,thblmut,jnsmut,pemkwh,rplwbp , rpwbp ,rpblok3 , rpkvarh , rpbeban,rp_kompor,rpptl,rpdiskon,rpreduksi,rptag,tgl_kargo
  from otc.data_bill
 where  thblrek = '202604' AND POSTINGBILLING>'1'
 and  ((COALESCE(rplwbp,0) + COALESCE(rpwbp,0) + COALESCE(rpblok3,0) + COALESCE(rpkvarh,0) + COALESCE(rpbeban,0)+ COALESCE(rp_kompor,0))-COALESCE(rpdiskon,0))!=rpptl


 select * from(
   SELECT a2.*,
          ROUND (a2.KWH_TARIFDAYA_BARU, 2) "KWH_TARIFDAYA_BARU",
          ROUND (a2.KWH_TARIFDAYA_LAMA, 2) "KWH_TARIFDAYA_LAMA",
          CASE
             WHEN status = 'MUTASI PERUBAHAN TARIF DAYA'
             THEN
                ROUND ( (KWH_TARIFDAYA_LAMA / (daya_lm / 1000)), 0)
             ELSE
                0
          END
             JAMNYALA_LM,
          CASE
             WHEN status = 'MUTASI PERUBAHAN TARIF DAYA'
             THEN
                ROUND ( (KWH_TARIFDAYA_BARU / (daya / 1000)), 0)
             ELSE
                round(a2.JAMNYALA,2)
          END
             JAMNYALA_BR,
          now() as tglrekap
     FROM (    
     SELECT a1.*,
      CASE WHEN status = 'MUTASI PERUBAHAN TARIF DAYA'  THEN
           (SELECT   COALESCE (PEMKWH_REG, 0) + COALESCE (PEMKWH_PREMIUM, 0)
           FROM otc.data_bill_energi b
           WHERE  thblrek = '202604' and jenis_energi='NORMAL'
           AND b.idpel = a1.idpel)
     ELSE
          a1.pemkwh
     END as KWH_TARIFDAYA_BARU,
     CASE WHEN status = 'MUTASI PERUBAHAN TARIF DAYA'  THEN
         (SELECT   COALESCE (PEMKWH_REG, 0)  + COALESCE (PEMKWH_PREMIUM, 0)
         FROM otc.data_bill_energi b
         WHERE  thblrek = '202604' and jenis_energi='PECAHAN'
         AND b.idpel = a1.idpel)
     ELSE
         0
     END as KWH_TARIFDAYA_LAMA
             FROM (
             SELECT a.unitupi,
                          (SELECT satuan || ' ' || nama NAMA_DIST
                             FROM bill52.unitupi G
                            WHERE G.UNITUPI = a.UNITUPI)
                             NAMA_DIST,
                          a.unitap,
                          (SELECT NAMA
                             FROM BILL52.UNITAP d
                            WHERE d.UNITAP = a.UNITAP)
                             NAMA_UNITAP,
                          a.unitup,
                          (SELECT NAMA
                             FROM BILL52.UNITUP e
                            WHERE e.UNITUP = a.UNITUP)
                             NAMA_UNITUP,
                          idpel,
                          thblrek,
                          tarif,
                          daya,
                          kdpt,
                          kdpt_2,
                          tarif_lm_pindah_trf as TARIF_LM,
                          daya_lm_pindah_trf  as daya_LM,
                          kdpt_lama_pindah_trf  as kdpt_LM,
                          kdam,
                          jnsmut,
                          thblmut,
                          POSTINGBILLING,
                          tglbacalalu,
                          tglbacaakhir,
                          tglrubah,
                          fakm,
                          slalwbp,
                          sahlwbp_cabut,
                          slalwbp_pasang,
                          sahlwbp,
                          slawbp,
                          sahwbp_cabut,
                          slawbp_pasang,
                          sahwbp,
                          slakvarh,
                          sahkvarh_cabut,
                          slakvarh_pasang,
                          sahkvarh,
                          pemkwh,
                          pemkvarh,
                          kelbkvarh,
                          pecahan,
                          jamnyala,
                          rptag,
                          kdproses,
                          msg,
                          tglhitung,
                          CASE
                             WHEN     a.thblrek = a.thblmut
                                  AND (jnsmut LIKE '%D%' OR jnsmut LIKE '%E%')
                             THEN
                                'MUTASI PERUBAHAN TARIF DAYA'
                             WHEN     a.thblrek = a.thblmut
                                  AND (jnsmut = 'J' OR jnsmut LIKE 'J%')
                             THEN
                                'MUTASI GANTI METER'
                             else
                                'REGULER TANPA MUTASI'
                          end as STATUS
from  otc.data_bill a
WHERE thblrek = '202604' and thblrek=thblmut 
AND postingbilling >= '1'
and idpel in('181110105743','181200073565')
)a1)a2) --where jamnyala_br>'720' or jamnyala_lm>'720'

select * from  kunabakti.vw_databill_phr_new
where thblrek='202604'

 
  select idpel,tarif,daya,thblmut,jnsmut,pemkwh,rplwbp , rpwbp ,rpblok3 , rpkvarh , rpbeban,rp_kompor,rpptl,rpdiskon,rpreduksi,
  rpptl,rpmat,rpbpju,rpppn,rpangsa,rpangsb,rpangsc,rpsewakap,rpsewatrafo,rpbptrafo,rptag,tgl_kargo
  from otc.data_bill
 where  thblrek = '202604' AND POSTINGBILLING>'1'
 and  (((COALESCE(rpptl,0) + COALESCE(rpbpju,0) + COALESCE(rpangsa,0) + COALESCE(rpangsb,0) + COALESCE(rpangsc,0)+ COALESCE(rpppn,0)
 +COALESCE(rpsewakap,0)+COALESCE(rpsewatrafo,0))+COALESCE(rpbptrafo,0))-COALESCE(rpreduksi,0))!=rptag

 
 select * from(
select TARIF,KDPT,THBL_AWAL,THBL_AKHIR,DAYA_MIN,DAYA_MAX,FAKTORK_VALUE,BBEBAN,BPAKAI1,BPAKAI2,BPAKAI3,BKVAR,JNSBATAS,BTSBLOK1,BTSBLOK2,BLOK,EMIN,JNSBATASEMIN,TRFLWBP_DASAR,TRFWBP_DASAR,TRFKVARH_DASAR,'ADJUSMENT' KETERANGAN,now() TGLREKAP
from otc.billap2t_tarif_tdl2010 where thbl_akhir='202607' order by tarif)


select  * from otc.billap2t_tarif_tdl2010 where thbl_akhir='202607' 


