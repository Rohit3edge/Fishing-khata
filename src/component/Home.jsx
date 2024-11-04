import React, { useState,useEffect } from "react";
import { GetTotalSales,GetTotalPurchase,GetTotalbankbalance,GetTotalCash,GetTotalSundryDebtors,GetTotalSundryCreditors,GetStockInventoryTotal } from "../store/slices/home";
import { GetProfitLoss } from '../store/slices/reports';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../common/Loader';
import Featured from "./featured/Featured";
import Chart from "./chart/Chart";
import Widget from "./widget/widget";
import AdminLayout from './AdminLayout';

function Home() {
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user'));
  const id = user?.data?.id;

  const today = new Date();

  // Financial year calculation
  const getFinancialYearStartDate = () => {
    const currentYear = today.getFullYear();
    return `${currentYear}-04-01`;
  };

  const getTodayFormattedDate = () => {
    return today.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
  };

  const [fromDate, setFromDate] = useState(getFinancialYearStartDate()); // Financial year start
  const [toDate, setToDate] = useState(getTodayFormattedDate());


  const [isLoading, setIsLoading] = useState(false);
  const [saleTotal, setSaleTotal] = useState();
  const [totalbankbalance, setTotalbankbalance] = useState();
  const [totalCash, setTotalCash] = useState();
  const [totalSundryDebtors, setTotalSundryDebtors] = useState();
  const [totalSundryCreditors, setTotalSundryCreditors] = useState();
  const [totalPurchase, setTotalPurchase] = useState();
  const [stockInventoryTotal, setStockInventoryTotal] = useState();
  const [profitLoss, setProfitLoss] = useState({});





  const fetchStocks = async () => {
    const newItem = {
      profile_id: id,
      from_date: getFinancialYearStartDate(),
      to_date:getTodayFormattedDate(),
    };
  
    try {
      const data = await dispatch(GetStockInventoryTotal(newItem)).unwrap();
      setStockInventoryTotal(data?.stock_value);
    } catch (error) {
      console.log('Error fetching stock:', error.message);
    }
  };
  

  const fetchProfitLoss = async () => {
    const newItem = {
      profile_id: id,
      from_date: fromDate, // Ensure from_date is sent
      to_date: toDate, // Ensure to_date is sent
    };

    try {
      const data = await dispatch(GetProfitLoss(newItem)).unwrap();
      setProfitLoss(data?.data?.income_statement?.["Gross Profit/Loss"])

    } catch (error) {
      console.log('Error fetching ', error.message);
    }
  };


  const fetchSaleTotal = async () => {
    try {
      const data = await dispatch(GetTotalSales({ profile_id: id})).unwrap();
      setSaleTotal(data?.data?.sale)

    } catch (error) {
      console.log('Error fetching ', error.message);
    }
  };

  const fetchPurchaseTotal = async () => {
    try {
      const data = await dispatch(GetTotalPurchase({ profile_id: id})).unwrap();
      setTotalPurchase(data?.data?.purchase);
    } catch (error) {
      console.log('Error fetching', error.message);
    }
  };

  const fetchTotalbankbalance = async () => {
    try {
      const data = await dispatch(GetTotalbankbalance({ profile_id: id})).unwrap();
      setTotalbankbalance(data?.total_bank_balance);
    } catch (error) {
      console.log('Error fetching ', error.message);
    }
  };

  const fetchTotalCash = async () => {
    try {
      const data = await dispatch(GetTotalCash({ profile_id: id})).unwrap();
      setTotalCash(data?.total_cash_balance);
    } catch (error) {
      console.log('Error fetching ', error.message);
    }
  };

  const fetchTotalSundryDebtors = async () => {
    try {
      const data = await dispatch(GetTotalSundryDebtors({ profile_id: id})).unwrap();
      setTotalSundryDebtors(data?.total_sundry_debtors_count);
    } catch (error) {
      console.log('Error fetching', error.message);
    }
  };

  const fetchTotalSundryCreditors = async () => {
    try {
      const data = await dispatch(GetTotalSundryCreditors({ profile_id: id})).unwrap();
      setTotalSundryCreditors(data?.total_sundry_creditors_count);
    } catch (error) {
      console.log('Error fetching ', error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPurchaseTotal(), fetchSaleTotal(),fetchTotalbankbalance(),fetchTotalSundryCreditors(),fetchTotalSundryDebtors(),fetchTotalCash(),fetchProfitLoss(),fetchStocks()]);
      setIsLoading(false);
    };

    fetchData();
  }, [dispatch, id]);


  return (
    <AdminLayout>
             {isLoading && <Loader />}
      <div className="row content-body">
        <div className="container-fluid">
          <div className="page-header">
            <div>
              <h2 className="main-content-title tx-24 mg-b-5">Dashboard</h2>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Dashboard
                </li>
              </ol>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card custom-card-home">
                <div className="card-body">
                <div className="container-fluid">
                  <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-6 col-12">
                          <div className="card-block pt-2 pb-0 d-flex" style={{ gap: '15px' }}>
                            <Widget type="FPO" amount={120} diff={15} title="FPO" link="See all FPO" isMoney={false} />
                            <Widget type="Share Capital" amount={1050}  title="Share Capital" link="See details" isMoney={true} />
                            <Widget type="Share Holder" amount={51}  title="Share Holder" link="See details" isMoney={false} />
                          </div>
                          <div className="card-block pt-2 pb-0 d-flex" style={{ gap: '15px' }}> 
                          <Widget type="Sale" amount={Number(saleTotal)} diff={-10} title="Sale" link="View Sale" isMoney={true} path="/invoicelist" />
                          <Widget type="Purchase" amount={Number(totalPurchase)} diff={8} title="Purchase" link="View Purchase" isMoney={true} path="/purchase/purchasevoucherlist" />
                            <Widget type="Net Profit" amount={profitLoss?.amount} diff={12} title={profitLoss?.description=="Gross Profit"?"Net Profit":"Net Loss"} link="See details" isMoney={true} path="/reports/profitandloss" />
                           
                          </div>
                          <div className="card-block pt-2 pb-0 d-flex" style={{ gap: '15px' }}> 
                          <Widget type="Stock" amount={stockInventoryTotal} diff={5} title="Stock" link="View all Stock" isMoney={true} path="/reports/stocksummary" />
                          <Widget type="Bank" amount={Number(totalbankbalance)} diff={5} title="Bank"  isMoney={true} />
                          <Widget type="Cash" amount={Number(totalCash)} diff={5} title="Cash"  isMoney={true} />
                          </div>
                          <div className="card-block pt-2 pb-0 d-flex" style={{ gap: '15px' }}>
                          <Widget type="Sundry Debtors" amount={Number(totalSundryDebtors)}  title="Sundry Debtors"  isMoney={false} />
                          <Widget type="Sundry Creditors" amount={Number(totalSundryCreditors)}  title="Sundry Creditors"  isMoney={false} />
                          <Widget type="Assets" amount={0}  title="Assets" link="See details" isMoney={false} />
                             </div>
                          {/* <div className="charts"> */}
                            {/* <Featured /> */}
                            {/* <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} /> */}
                          {/* </div> */}
                          <div id="Widget-line-chart" className="height-70 lineChartWidget WidgetlineChart mb-2"></div>
                        </div>
                    </div>
                  
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Home;