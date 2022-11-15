import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import ParosLogoGnb from 'public/paros/logo-gnb.svg';
import ParosBtnGnbLogin from 'public/paros/btn-gnb-login.svg';
import ParosBtnGnbJoin from 'public/paros/btn-gnb-join.svg';
import ParosBtnGnbTrip from 'public/paros/btn-gnb-trip.svg';
import ParosBtnGnbCenter from 'public/paros/btn-gnb-center.svg';
import { PalosMainStyle } from './main';
import { SearchBar } from '@components/common/SearchBar';
import { Grid } from '@mui/material';

interface HeaderProps {
  sections: ReadonlyArray<{
    title: string;
    url: string;
  }>;
  title: string;
  palosMainStyles: PalosMainStyle
}

export default function Header(props: HeaderProps) {
  const { sections, title, palosMainStyles } = props;
  const initialSearchVal = ''
  const [search, setSearch] = React.useState(initialSearchVal)

  return (
    <React.Fragment>
      <div style={{
        // width: '1920px',
        width: '100%',
        height: '25px',
        // margin: '0 0 15px',
        // padding: '4px 1393px 3px 320px',
        backgroundImage: 'linear-gradient(to right, #be1d25, #3c3b6e)',
      }}>
        <span style={{
          width: '207px',
          height: '18px',
          fontFamily: ' NotoSansCJKKR',
          fontSize: '12px',
          fontWeight: '300',
          fontStretch: 'normal',
          fontStyle: 'normal',
          lineHeight: 'normal',
          letterSpacing: ' -0.48px',
          textAlign: 'right',
          color: '#fff',
          paddingLeft: palosMainStyles.padding.paddingLeft
        }}>
          <span style={{ fontWeight: 'normal', }}>헬로캐나다</span>
          ㅣ 미국&캐나다 전문 여행브랜드
        </span>
      </div>
      <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}
        style={{
          paddingLeft: palosMainStyles.padding.paddingLeft,
          paddingRight: palosMainStyles.padding.paddingRight
        }}>
        {/* <Button size="small">Subscribe</Button> */}
        {/* <ParosLogoGnb viewBox="0 0 60 48" width="200px" height="40px" /> */}
        {/* <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}> */}
        <Grid container spacing={2}>
          <Grid item xs={6} md={4}>
            <ParosLogoGnb width="200px" height="40px" />
          </Grid>
          <Grid item xs={6} md={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <SearchBar
              onChange={(e) => { setSearch(e.target.value) }}
              onClick={() => {
                // routePush(1, email)
                setSearch(initialSearchVal)
              }}
              placeHolder='' />
          </Grid>
          <Grid item xs={4} md={4}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            {/* <div style={{
              height: "20px", display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}> */}

            {/* <span
              style={{
                // width: '38px',
                // height: '15px',
                fontFamily: 'NotoSansCJKKR',
                fontSize: '14px',
                fontWeight: 'normal',
                fontStretch: 'normal',
                fontStyle: 'normal',
                lineHeight: 'normal',
                letterSpacing: '-0.56px',
                textAlign: 'right',
                color: '#404040',

                height: "20px", display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}> */}
            <Grid container spacing={2}
              style={{
                // width: '38px',
                // height: '15px',
                fontFamily: 'NotoSansCJKKR',
                fontSize: '14px',
                fontWeight: 'normal',
                fontStretch: 'normal',
                fontStyle: 'normal',
                lineHeight: 'normal',
                letterSpacing: '-0.56px',
                textAlign: 'center',
                color: '#404040',

                height: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minWidth: '380px',
                // width: '380px'
              }}>
              <Grid item xs={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: '70px'
                }}>
                <ParosBtnGnbLogin width="15px" />
                <span>로그인</span>
              </Grid>
              <Grid item xs={1}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: '1px'
                }}>
                <span>|</span>
              </Grid>
              <Grid item xs={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: '80px'
                }}>
                <ParosBtnGnbJoin width="15px" />
                <span>회원가입</span>
              </Grid>
              <Grid item xs={1}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: '1px'
                }}>
                <span>|</span>
              </Grid>
              <Grid item xs={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: '80px'
                }}>
                <ParosBtnGnbTrip width="15px" />
                <span>맞춤여행</span>
              </Grid>
              <Grid item xs={1}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: '1px'
                }}>
                <span>|</span>
              </Grid>
              <Grid item xs={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: '80px'
                }}>
                <ParosBtnGnbCenter width="15px" />
                <span>고객센터</span>
              </Grid>
            </Grid>
            {/* </span> */}
            {/* </div> */}
          </Grid>
        </Grid>
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-between', overflowX: 'auto' }}
      >
        {sections.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            sx={{ p: 1, flexShrink: 0 }}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}
