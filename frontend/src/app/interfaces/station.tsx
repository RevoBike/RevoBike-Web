export interface Station {
  id: number;
  name: string;
  address: string;
  capacity: number;
  bikes: number;
}

export interface FormValues {
  name: string;
  address: string;
  capacity: string;
}

export interface HandleSubmitProps {
  (values: FormValues): void;
}

export interface EditStationModalProps {
  opened: boolean;
  onClose: () => void;
  station: Station;
}
