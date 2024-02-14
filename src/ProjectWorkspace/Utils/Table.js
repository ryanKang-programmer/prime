
import './Table.css';
  
// Example of a data array that
// you might receive from an API
const data = [
  { no: "1", lineID: "019841023", operation: "On", map: "true" },
  { no: "2", lineID: "1203918204", operation: "Off", map: "false" },
  { no: "3", lineID: "478192742", operation: "On", map: "false" },
  { no: "4", lineID: "5123819748", operation: "On", map: "false" },
  { no: "5", lineID: "581723918", operation: "Off", map: "false" },
  { no: "6", lineID: "098120941", operation: "Off", map: "false" },
  { no: "7", lineID: "32418983", operation: "Off", map: "false" },
  { no: "8", lineID: "512351927", operation: "On", map: "false" },
  { no: "1", lineID: "019841023", operation: "On", map: "true" },
  { no: "2", lineID: "12039182", operation: "Off", map: "false" },
  { no: "3", lineID: "478192742", operation: "On", map: "false" },
  { no: "4", lineID: "5123819748", operation: "On", map: "false" },
  { no: "5", lineID: "581723918", operation: "Off", map: "false" },
  { no: "6", lineID: "098123841", operation: "Off", map: "false" },
  { no: "7", lineID: "32418983", operation: "Off", map: "false" },
  { no: "8", lineID: "512351938", operation: "On", map: "false" },
]

const yLabels = ["Low", "Moderate", "High", "Critical", "AAAAAAAAAAAA"];

const tableConstants = [
  [2, 2, 3, 4, 4],
  [2, 3, 3, 4, 5],
  [3, 4, 4, 5, 5],
  [5, 5, 5, 5, 6],
  [6, 6, 6, 6, 6]
]

const matrix = [
  { title: "Low", f1: "green", f2: "green", f3: "yellow", f4: "orange", f5: "orange"},
  { title: "Moderate", f1: "green", f2: "yellow", f3: "yellow", f4: "orange", f5: "red"},
  { title: "High", f1: "yellow", f2: "orange", f3: "orange", f4: "red", f5: "red"},
  { title: "Critical", f1: "red", f2: "red", f3: "red", f4: "red", f5: "black"},
  { title: "AAAAAAAAAAAA", f1: "black", f2: "black", f3: "black", f4: "black", f5: "black"}
]
  
function Table(props) {
  let left = <div>{props.tableName}</div>
  if (props.tableName == "matrix") {
    left = <div>
              <div className={"Table " + (props.className)}>
                <table>
                  <tr>
                    <th colspan="6"> </th>
                  </tr>
                  <tr>
                    <th> </th>
                    <th colspan="5">Damage factor</th>
                  </tr>
                  <tr>
                    <th>Leak factor</th>
                    <th>Zero</th>
                    <th>Very Low</th>
                    <th>Low</th>
                    <th>High</th>
                    <th>Critical</th>
                  </tr>
                  {matrix.map((val, key) => {
                  return (
                    <tr key={key}>
                      <th>{val.title}</th>
                      <td className={val.f1}> </td>
                      <td className={val.f2}> </td>
                      <td className={val.f3}> </td>
                      <td className={val.f4}> </td>
                      <td className={val.f5}> </td>
                    </tr>
                  )
                })}
                </table>
                <br />
                <br />
                <br />
                <br />
                <br />
              </div>
          </div>
  } else {
    left = <div style={{width: "100%", height: '100%', overflow: 'auto'}}>
            <div>
              <table>
                <tr>
                  <th>No.</th>
                  <th>Line ID</th>
                  <th>Operation</th>
                  <th>Map</th>
                </tr>
                {data.map((val, key) => {
                  return (
                    <tr key={key}>
                      <td>{val.no}</td>
                      <td>{val.lineID}</td>
                      <td>{val.operation}</td>
                      <td>{val.map}</td>
                    </tr>
                  )
                })}
              </table>
            </div>
          </div>
  }

  return (
    <div>
      {left}
    </div>
  );
}

export default Table;