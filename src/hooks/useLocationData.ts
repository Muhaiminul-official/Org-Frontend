import { useMemo } from 'react';
import locationData from '../data/locations.json';

export function useLocationData(
  selectedDivision: string,
  selectedDistrict: string,
) {
  const divisions = useMemo(
    () => locationData.map(d => ({ division: d.division })),
    [],
  );

  const districts = useMemo(() => {
    if (!selectedDivision || selectedDivision === 'All Divisions') return [];

    const division = locationData.find(d => d.division === selectedDivision);

    if (!division) return [];

    return division.districts.map(d => ({
      district: d.district,
      upazilla: d.upazilas,
    }));
  }, [selectedDivision]);

  const upazilas = useMemo(() => {
    if (!selectedDistrict || selectedDistrict === 'All Districts') return [];

    const district = districts.find(d => d.district === selectedDistrict);

    return district ? district.upazilla : [];
  }, [districts, selectedDistrict]);

  return {
    divisions,
    districts,
    upazilas,
    loadingDivisions: false,
    loadingDistricts: false,
  };
}
