import { useEffect, useState } from 'react';
import { HOST_IO_TOKEN, BASE_URL } from './constants';

interface IHostIORequestParams {
  limit?: number;
  token?: string;
}

interface IHostIORequest {
  data: any[];
  isLoading: boolean;
  requestHostIO: (value: string[]) => void;
  error: { isError: boolean; message?: string }[];
}

const useHostIORequest = ({
  limit = 10,
  token = HOST_IO_TOKEN
}: IHostIORequestParams = {}): IHostIORequest => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [error, setErrors] = useState<IHostIORequest['error']>([]);
  const [domains, setDomains] = useState<string[]>(['']);

  useEffect(() => {
    if (!isLoading) return;
    let isUnmounted = false;

    // also could use async/await syntax, Promise chaining is my personal preference
    Promise.all(
      domains.map((domain) =>
        fetch(`${BASE_URL}/${domain}/?token=${token}&limit=${limit}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      )
    )
      .then((values) => Promise.all(values.map((v) => v.json())))
      .then((data) => {
        if (isUnmounted) return;
        const _errors: IHostIORequest['error'] = [];
        const _data: any[] = [];
        data.forEach((value) => {
          if (value.error) {
            _errors.push(value);
          } else {
            _data.push(value);
          }
        });

        setData(_data);
        setErrors(_errors);
        setIsLoading(false);
      });
    return () => {
      isUnmounted = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const requestHostIO = (domains: string[]) => {
    setIsLoading(true);
    setDomains(domains);
  };

  return { data, isLoading, requestHostIO, error };
};

export default useHostIORequest;
